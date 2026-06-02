package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
        int capacity = trip.getVehicle() != null ? trip.getVehicle().getCapacity() : 50;
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

