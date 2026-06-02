package pk.backend.service.report;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.dto.reports.CourseReportRequest;
import pk.backend.dto.reports.CourseReportResponse;
import pk.backend.dto.reports.PassengersByStopSegment;
import pk.backend.entity.reservation.ReservationStatus;
import pk.backend.entity.reservation.Ticket;
import pk.backend.entity.trip.Route;
import pk.backend.entity.trip.Trip;
import pk.backend.entity.vehicle.FuelRecord;
import pk.backend.entity.vehicle.Vehicle;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseReportService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<CourseReportResponse> generate(CourseReportRequest request) {
        validate(request);

        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();

        LocalDateTime from = start.atStartOfDay();
        LocalDateTime to = end.atTime(23, 59, 59);

        String agg = request.getAggregation().trim().toUpperCase(Locale.ROOT);

        // Load trips in range with optional filters.
        List<Trip> trips = loadTrips(request, from, to);

        // Preload tickets + fuel records in one go (in-memory aggregation).
        // Trips might be empty.
        List<Ticket> tickets = trips.isEmpty() ? Collections.emptyList() : loadTicketsForTrips(trips);
        List<FuelRecord> fuelRecords = loadFuelRecords(request, start, end, trips);

        // Vehicles referenced by trips (for ticket price/fuel mapping as per current model).
        // revenue: sum(ticket.price) for non-cancelled tickets within range
        // profit: revenue - fuelCost

        // passengersByStops: current model doesn't store passenger boarding/alighting stops.
        // Best approximation: count each active ticket as passenger across route segments.

        Map<Object, List<Trip>> tripsByPeriod = groupTripsByPeriod(trips, agg);

        List<CourseReportResponse> result = new ArrayList<>();
        for (Object key : sortKeys(tripsByPeriod, agg)) {
            List<Trip> periodTrips = tripsByPeriod.get(key);

            double revenue = sumRevenue(tickets, periodTrips);
            double fuelCost = sumFuelCost(fuelRecords, periodTrips);
            double profit = revenue - fuelCost;

            List<PassengersByStopSegment> passengersByStops = buildPassengersByStops(periodTrips, tickets);

            String periodLabel = formatPeriodLabel(key, agg);
            result.add(new CourseReportResponse(
                    periodLabel,
                    passengersByStops,
                    revenue,
                    fuelCost,
                    profit
            ));
        }

        return result;
    }

    private void validate(CourseReportRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("startDate and endDate are required");
        }
        if (request.getAggregation() == null || request.getAggregation().isBlank()) {
            throw new IllegalArgumentException("aggregation is required (DAY/WEEK/MONTH/YEAR)");
        }
        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("endDate must be >= startDate");
        }
    }

    private List<Trip> loadTrips(CourseReportRequest request, LocalDateTime from, LocalDateTime to) {
        StringBuilder jpql = new StringBuilder();
        jpql.append("select t from Trip t " +
                "left join fetch t.route r " +
                "left join fetch t.vehicle v " +
                "left join fetch t.driver d " +
                "where t.departureTime >= :from and t.departureTime <= :to");

        if (request.getVehicleId() != null) {
            jpql.append(" and t.vehicle.vehicleID = :vehicleId");
        }
        if (request.getDriverId() != null) {
            // NOTE: In current model the PK for driver is Employee.userID (inherited from User).
            // The frontend provides driverId as integer; we treat it as that PK.
            jpql.append(" and t.driver.userID = :driverId");
        }


        var q = entityManager.createQuery(jpql.toString(), Trip.class);
        q.setParameter("from", from);
        q.setParameter("to", to);
        if (request.getVehicleId() != null) {
            q.setParameter("vehicleId", request.getVehicleId());
        }

        // driver filtering left for later refinement
        return q.getResultList();
    }

    private List<Ticket> loadTicketsForTrips(List<Trip> trips) {
        List<Integer> tripIds = trips.stream().map(Trip::getTripID).filter(Objects::nonNull).collect(Collectors.toList());
        if (tripIds.isEmpty()) return Collections.emptyList();

        return entityManager.createQuery(
                        "select tk from Ticket tk join tk.reservation r join r.trip t " +
                                "where t.tripID in :tripIds and tk.status in (:st1, :st2)",
                        Ticket.class)
                .setParameter("tripIds", tripIds)
                .setParameter("st1", ReservationStatus.RESERVED)
                .setParameter("st2", ReservationStatus.COMPLETED)
                .getResultList();
    }

    private List<FuelRecord> loadFuelRecords(CourseReportRequest request, LocalDate start, LocalDate end, List<Trip> trips) {
        if (trips.isEmpty()) return Collections.emptyList();

        // cost: sum FuelRecord.cost where fuelRecord.vehicle in vehicles used by trips and date in range
        List<Integer> vehicleIds = trips.stream()
                .map(Trip::getVehicle)
                .filter(Objects::nonNull)
                .map(Vehicle::getVehicleID)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        if (vehicleIds.isEmpty()) return Collections.emptyList();

        return entityManager.createQuery(
                        "select fr from FuelRecord fr where fr.date >= :start and fr.date <= :end and fr.vehicle.vehicleID in :vehicleIds",
                        FuelRecord.class)
                .setParameter("start", start)
                .setParameter("end", end)
                .setParameter("vehicleIds", vehicleIds)
                .getResultList();
    }

    private Map<Object, List<Trip>> groupTripsByPeriod(List<Trip> trips, String agg) {
        if (agg.equals("YEAR")) {
            return trips.stream().collect(Collectors.groupingBy(t -> t.getDepartureTime().getYear()));
        }
        if (agg.equals("MONTH")) {
            return trips.stream().collect(Collectors.groupingBy(t -> YearMonth.from(t.getDepartureTime().toLocalDate())));
        }
        if (agg.equals("WEEK")) {
            return trips.stream().collect(Collectors.groupingBy(t -> {
                var d = t.getDepartureTime().toLocalDate();
                int year = d.getYear();
                int week = d.get(IsoFieldsHelper.WEEK_OF_WEEK_BASED_YEAR);
                return year + "-W" + week;
            }));
        }
        // DAY
        return trips.stream().collect(Collectors.groupingBy(t -> t.getDepartureTime().toLocalDate()));
    }

    private List<Object> sortKeys(Map<Object, List<Trip>> byPeriod, String agg) {
        return byPeriod.keySet().stream().sorted((a, b) -> {
            if (agg.equals("YEAR")) return Integer.compare((int) a, (int) b);
            return a.toString().compareTo(b.toString());
        }).collect(Collectors.toList());
    }

    private String formatPeriodLabel(Object key, String agg) {
        if (agg.equals("YEAR")) return key.toString();
        if (agg.equals("MONTH")) return key.toString();
        if (agg.equals("DAY")) {
            LocalDate d = (LocalDate) key;
            return d.format(DateTimeFormatter.ISO_LOCAL_DATE);
        }
        // WEEK
        return key.toString();
    }

    private double sumRevenue(List<Ticket> tickets, List<Trip> periodTrips) {
        if (periodTrips.isEmpty() || tickets.isEmpty()) return 0d;
        List<Integer> tripIds = periodTrips.stream().map(Trip::getTripID).collect(Collectors.toList());
        return tickets.stream()
                .filter(tk -> tk.getReservation() != null && tk.getReservation().getTrip() != null)
                .filter(tk -> tripIds.contains(tk.getReservation().getTrip().getTripID()))
                .mapToDouble(tk -> tk.getPrice() == null ? 0d : tk.getPrice())
                .sum();
    }

    private double sumFuelCost(List<FuelRecord> fuelRecords, List<Trip> periodTrips) {
        if (periodTrips.isEmpty() || fuelRecords.isEmpty()) return 0d;
        List<Integer> vehicleIds = periodTrips.stream()
                .map(Trip::getVehicle)
                .filter(Objects::nonNull)
                .map(Vehicle::getVehicleID)
                .collect(Collectors.toList());
        return fuelRecords.stream()
                .filter(fr -> fr.getVehicle() != null && vehicleIds.contains(fr.getVehicle().getVehicleID()))
                .mapToDouble(fr -> fr.getCost() == null ? 0d : fr.getCost())
                .sum();
    }

    private List<PassengersByStopSegment> buildPassengersByStops(List<Trip> periodTrips, List<Ticket> allTickets) {
        if (periodTrips.isEmpty()) return List.of();

        // We approximate passengers by counting active tickets and distributing them equally across each adjacent stop pair.
        // PassengersByStopSegment labels follow "StopA -> StopB".
        Map<String, Long> counts = new HashMap<>();

        List<Integer> tripIds = periodTrips.stream().map(Trip::getTripID).collect(Collectors.toList());
        List<Trip> tripsWithRoute = periodTrips.stream().filter(t -> t.getRoute() != null).collect(Collectors.toList());

        for (Trip trip : tripsWithRoute) {
            Route route = trip.getRoute();
            if (route.getStops() == null || route.getStops().size() < 2) continue;

            long activeTicketsForTrip = allTickets.stream()
                    .filter(tk -> tk.getReservation() != null && tk.getReservation().getTrip() != null)
                    .filter(tk -> tripIds.contains(tk.getReservation().getTrip().getTripID()))
                    .count();

            // distribute same passenger count across each adjacent segment
            for (int i = 0; i < route.getStops().size() - 1; i++) {
                String label = route.getStops().get(i).getName() + " -> " + route.getStops().get(i + 1).getName();
                counts.merge(label, activeTicketsForTrip, Long::sum);
            }
        }

        return counts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new PassengersByStopSegment(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    private static class IsoFieldsHelper {
        // ISO week fields without importing java.time.temporal.IsoFields globally in this file.
        static final java.time.temporal.TemporalField WEEK_OF_WEEK_BASED_YEAR = java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR;
    }
}

