package pk.backend.service.report;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.dto.reports.ReservationReportRequest;
import pk.backend.dto.reports.ReservationReportResponse;
import pk.backend.entity.reservation.Reservation;
import pk.backend.entity.reservation.ReservationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationReportService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<ReservationReportResponse> generate(ReservationReportRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("startDate and endDate are required");
        }
        if (request.getAggregation() == null || request.getAggregation().isBlank()) {
            throw new IllegalArgumentException("aggregation is required (MONTH/YEAR)");
        }

        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();

        if (end.isBefore(start)) {
            throw new IllegalArgumentException("endDate must be >= startDate");
        }

        LocalDateTime from = start.atStartOfDay();
        LocalDateTime to = end.atTime(23, 59, 59);

        String agg = request.getAggregation().trim().toUpperCase(Locale.ROOT);
        if (!agg.equals("MONTH") && !agg.equals("YEAR")) {
            throw new IllegalArgumentException("aggregation must be MONTH or YEAR");
        }

        // Load reservations in range; aggregate in memory.
        // (No repository-level custom queries were present in the project so far.)
        List<Reservation> reservations = entityManager
                .createQuery(
                        "select r from Reservation r " +
                                "where r.createdAt >= :from and r.createdAt <= :to and r.status = :status",
                        Reservation.class)
                .setParameter("from", from)
                .setParameter("to", to)
                .setParameter("status", ReservationStatus.RESERVED)
                .getResultList();

        if (agg.equals("YEAR")) {
            Map<Integer, List<Reservation>> byYear = reservations.stream()
                    .collect(Collectors.groupingBy(r -> r.getCreatedAt().getYear()));

            List<ReservationReportResponse> result = new ArrayList<>();
            byYear.entrySet().stream()
                    .sorted(Comparator.comparingInt(Map.Entry::getKey))
                    .forEach(e -> {
                        int year = e.getKey();
                        long reservationsCount = e.getValue().size();
                        long seatsSold = e.getValue().stream().mapToLong(Reservation::getSeatCount).sum();
                        double revenue = e.getValue().stream().map(r -> r.getTotalPrice() == null ? 0d : r.getTotalPrice()).mapToDouble(Double::doubleValue).sum();
                        result.add(new ReservationReportResponse(String.valueOf(year), reservationsCount, seatsSold, revenue));
                    });
            return result;
        }

        // MONTH
        Map<YearMonth, List<Reservation>> byMonth = reservations.stream()
                .collect(Collectors.groupingBy(r -> YearMonth.from(r.getCreatedAt())));

        List<ReservationReportResponse> result = new ArrayList<>();
        byMonth.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .forEach(e -> {
                    YearMonth ym = e.getKey();
                    long reservationsCount = e.getValue().size();
                    long seatsSold = e.getValue().stream().mapToLong(Reservation::getSeatCount).sum();
                    double revenue = e.getValue().stream().map(r -> r.getTotalPrice() == null ? 0d : r.getTotalPrice()).mapToDouble(Double::doubleValue).sum();
                    result.add(new ReservationReportResponse(ym.toString(), reservationsCount, seatsSold, revenue));
                });

        return result;
    }
}

