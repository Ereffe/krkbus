package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.dto.ReservationCreateRequest;
import pk.backend.dto.ReservationDTO;
import pk.backend.entity.reservation.Reservation;
import pk.backend.entity.reservation.ReservationStatus;
import pk.backend.entity.reservation.Ticket;
import pk.backend.entity.trip.Trip;
import pk.backend.entity.user.Client;
import pk.backend.repository.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TripRepository tripRepository;
    private final ClientRepository clientRepository;
    private final TicketRepository ticketRepository;

    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        Trip trip = tripRepository.findById(reservationDTO.getTripID())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Client client = clientRepository.findById(reservationDTO.getClientID())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (trip.getAvailableSeats() < reservationDTO.getSeatCount()) {
            throw new RuntimeException("Not enough available seats");
        }

        // Find taken seats for this trip
        List<Ticket> existingTickets = ticketRepository.findByReservationTripTripID(trip.getTripID());
        Set<Integer> takenSeats = existingTickets.stream()
                .filter(t -> t.getStatus() != ReservationStatus.CANCELLED)
                .map(Ticket::getSeatNumber)
                .collect(Collectors.toSet());

        Reservation reservation = new Reservation();
        reservation.setTrip(trip);
        reservation.setClient(client);
        reservation.setSeatCount(reservationDTO.getSeatCount());
        reservation.setStatus(ReservationStatus.RESERVED);
        reservation.setCreatedAt(LocalDateTime.now());
        
        float totalPrice = trip.getBasePrice() * reservationDTO.getSeatCount();
        reservation.setTotalPrice(totalPrice);

        Reservation savedReservation = reservationRepository.save(reservation);

        Set<Ticket> tickets = new HashSet<>();


        //
        Integer capacityObj = trip.getVehicle() != null
                ? trip.getVehicle().getCapacity()
                : null;

        int capacity = capacityObj != null ? capacityObj : 50;
        //


        List<Integer> availableSeatNumbers = IntStream.rangeClosed(1, capacity)
                .filter(s -> !takenSeats.contains(s))
                .boxed()
                .limit(reservationDTO.getSeatCount())
                .collect(Collectors.toList());

        if (availableSeatNumbers.size() < reservationDTO.getSeatCount()) {
             throw new RuntimeException("Could not assign requested number of seats");
        }

        for (Integer seatNum : availableSeatNumbers) {
            Ticket ticket = new Ticket();
            ticket.setReservation(savedReservation);
            ticket.setPrice(trip.getBasePrice());
            ticket.setStatus(ReservationStatus.RESERVED);
            ticket.setSeatNumber(seatNum);
            tickets.add(ticketRepository.save(ticket));
        }
        savedReservation.setTickets(tickets);

        trip.setAvailableSeats(trip.getAvailableSeats() - reservationDTO.getSeatCount());
        tripRepository.save(trip);

        int pointsEarned = (int) (totalPrice / 10);
        int currentPoints = client.getLoyaltyPoints() != null ? client.getLoyaltyPoints() : 0;
        client.setLoyaltyPoints(currentPoints + pointsEarned);
        clientRepository.save(client);

        return mapToDTO(savedReservation);
    }

    @Transactional
    public ReservationDTO cancelReservation(Integer reservationID) {
        Reservation reservation = reservationRepository.findById(reservationID)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new RuntimeException("Reservation is already cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());

        // Release seats
        Trip trip = reservation.getTrip();
        trip.setAvailableSeats(trip.getAvailableSeats() + reservation.getSeatCount());
        tripRepository.save(trip);

        // Cancel all tickets
        if (reservation.getTickets() != null) {
            for (Ticket ticket : reservation.getTickets()) {
                ticket.setStatus(ReservationStatus.CANCELLED);
                ticketRepository.save(ticket);
            }
        }

        // Refund loyalty points
        Client client = reservation.getClient();
        int pointsToDeduct = (int) (reservation.getTotalPrice() / 10);
        int currentPoints = client.getLoyaltyPoints() != null ? client.getLoyaltyPoints() : 0;
        client.setLoyaltyPoints(Math.max(0, currentPoints - pointsToDeduct));
        clientRepository.save(client);

        return mapToDTO(reservationRepository.save(reservation));
    }

    public ReservationDTO createReservationByRouteAndDate(ReservationCreateRequest request) {
        if (request.getReservationDate() == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "reservationDate is required");
        }
        if (request.getSeatCount() == null || request.getSeatCount() <= 0) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "seatCount must be greater than 0");
        }
        if (request.getRouteID() == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "routeID is required");
        }


        // Find trip by route and (optionally) date.
        // Your UI sometimes provides only route context, so if reservationDate does not match any trip,
        // we fall back to selecting the next available trip for this route.
        //
        // Preferred: route + same LocalDate of departure.
        var byRoute = tripRepository.findAll().stream()
                .filter(t -> t.getRoute() != null)
                .filter(t -> request.getRouteID().equals(t.getRoute().getRouteID()))
                .filter(t -> t.getDepartureTime() != null)
                .collect(Collectors.toList());

        Trip trip;
        if (request.getReservationDate() != null) {
            trip = byRoute.stream()
                    .filter(t -> t.getDepartureTime().toLocalDate().equals(request.getReservationDate()))
                    .findFirst()
                    .orElse(null);
        } else {
            trip = null;
        }

        if (trip == null) {
            trip = byRoute.stream()
                    .sorted(java.util.Comparator.comparing(Trip::getDepartureTime))
                    .findFirst()
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.NOT_FOUND,
                            "Trip not found for routeID=" + request.getRouteID() + (request.getReservationDate() != null ? ", reservationDate=" + request.getReservationDate() : "")
                    ));
        }





        // Find current logged-in client is out of scope (existing createReservation uses clientID).
        // For now, use clientID from JWT principal if available; otherwise require clientID from DTO endpoint.
        // We'll resolve client from security context.
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "No authenticated user");
        }

        String username;
        if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            username = userDetails.getUsername();
        } else if (authentication.getPrincipal() instanceof String s) {
            username = s;
        } else {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Unsupported authentication principal");
        }

        Client client = clientRepository.findAll().stream()
                .filter(c -> c.getLogin() != null && c.getLogin().equals(username))
                .findFirst()
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Client not found for authenticated user"));



        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setTripID(trip.getTripID());
        reservationDTO.setClientID(client.getUserID());
        reservationDTO.setSeatCount(request.getSeatCount());

//        System.out.println("routeID = " + request.getRouteID());
//        System.out.println("reservationDate = " + request.getReservationDate());
//
//        System.out.println("Trips found: " + byRoute.size());
//
//        byRoute.forEach(t ->
//                System.out.println(
//                        "Trip: " + t.getTripID() +
//                                " departure=" + t.getDepartureTime()
//                )

        return createReservation(reservationDTO);
    }

    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getAllReservationsDetailed() {
        return reservationRepository.findAll().stream().map(res -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", res.getReservationID());
            
            String passengerName = "—";
            if (res.getClient() != null && res.getClient().getProfile() != null) {
                String fName = res.getClient().getProfile().getFirstName() != null ? res.getClient().getProfile().getFirstName() : "";
                String lName = res.getClient().getProfile().getLastName() != null ? res.getClient().getProfile().getLastName() : "";
                passengerName = (fName + " " + lName).trim();
                if (passengerName.isEmpty()) passengerName = res.getClient().getLogin();
            }
            map.put("passenger", passengerName);
            
            String seats = "—";
            if (res.getTickets() != null && !res.getTickets().isEmpty()) {
                seats = res.getTickets().stream()
                        .map(t -> String.valueOf(t.getSeatNumber()))
                        .collect(Collectors.joining(", "));
            }
            map.put("seat", seats);
            
            String routeId = "—";
            String date = "—";
            if (res.getTrip() != null) {
                if (res.getTrip().getRoute() != null) {
                    routeId = String.valueOf(res.getTrip().getRoute().getRouteID());
                }
                if (res.getTrip().getDepartureTime() != null) {
                    date = res.getTrip().getDepartureTime().toLocalDate().toString();
                }
            }
            map.put("routeId", routeId);
            map.put("date", date);
            
            return map;
        }).collect(Collectors.toList());
    }

    private ReservationDTO mapToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setReservationID(reservation.getReservationID());
        dto.setTripID(reservation.getTrip().getTripID());
        dto.setClientID(reservation.getClient().getUserID());
        dto.setSeatCount(reservation.getSeatCount());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus());
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setCancelledAt(reservation.getCancelledAt());
        return dto;
    }

}

