package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.reservation.Reservation;
import pk.backend.entity.trip.Trip;
import pk.backend.entity.trip.Route;
import pk.backend.entity.user.Client;
import pk.backend.entity.user.Employee;
import pk.backend.entity.vehicle.Vehicle;
import pk.backend.repository.TripRepository;
import pk.backend.repository.RouteRepository;
import pk.backend.repository.EmployeeRepository;
import pk.backend.repository.VehicleRepository;
import pk.backend.dto.TripDTO;
import pk.backend.dto.TripResponseDTO;
import pk.backend.dto.ReservationResponseDTO;
import pk.backend.dto.ClientDTO;
import pk.backend.entity.reservation.Ticket;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TripService {

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final EmployeeRepository employeeRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public List<TripResponseDTO> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TripResponseDTO getTripById(Integer id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trip with ID " + id + " not found"));
        return mapEntityToResponseDto(trip);
    }

    @Transactional
    public TripResponseDTO createTrip(TripDTO tripDTO) {
        Trip trip = new Trip();
        mapDtoToEntity(tripDTO, trip);
        return mapEntityToResponseDto(tripRepository.save(trip));
    }

    @Transactional
    public TripResponseDTO updateTrip(Integer id, TripDTO tripDTO) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trip with ID " + id + " not found"));
        mapDtoToEntity(tripDTO, trip);
        return mapEntityToResponseDto(tripRepository.save(trip));
    }

    @Transactional
    public void deleteTrip(Integer id) {
        if (!tripRepository.existsById(id)) {
            throw new EntityNotFoundException("Trip with ID " + id + " not found");
        }
        tripRepository.deleteById(id);
    }

    private void mapDtoToEntity(TripDTO dto, Trip trip) {
        trip.setDepartureTime(dto.getDepartureTime());
        trip.setArrivalTime(dto.getArrivalTime());
        trip.setBasePrice(dto.getBasePrice());
        trip.setAvailableSeats(dto.getAvailableSeats());

        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                    .orElseThrow(
                            () -> new EntityNotFoundException("Vehicle with ID " + dto.getVehicleId() + " not found"));
            trip.setVehicle(vehicle);
        } else {
            trip.setVehicle(null);
        }

        if (dto.getDriverId() != null) {
            Employee driver = employeeRepository.findById(dto.getDriverId())
                    .orElseThrow(
                            () -> new EntityNotFoundException("Employee with ID " + dto.getDriverId() + " not found"));
            trip.setDriver(driver);
        } else {
            trip.setDriver(null);
        }

        if (dto.getRouteId() != null) {
            Route route = routeRepository.findById(dto.getRouteId())
                    .orElseThrow(() -> new EntityNotFoundException("Route with ID " + dto.getRouteId() + " not found"));
            trip.setRoute(route);
        } else {
            trip.setRoute(null);
        }
    }

    private TripResponseDTO mapEntityToResponseDto(Trip trip) {
        TripResponseDTO dto = new TripResponseDTO();
        dto.setTripID(trip.getTripID());
        dto.setDepartureTime(trip.getDepartureTime());
        dto.setArrivalTime(trip.getArrivalTime());
        dto.setBasePrice(trip.getBasePrice());
        dto.setAvailableSeats(trip.getAvailableSeats());

        if (trip.getVehicle() != null) {
            dto.setVehicleId(trip.getVehicle().getVehicleID());
        }
        if (trip.getDriver() != null) {
            dto.setDriverId(trip.getDriver().getUserID());
        }
        if (trip.getRoute() != null) {
            dto.setRouteId(trip.getRoute().getRouteID());
        }

        if (trip.getReservations() != null) {
            Set<ReservationResponseDTO> reservationDTOs = trip.getReservations().stream()
                    .map(this::mapReservationToResponseDto)
                    .collect(Collectors.toSet());
            dto.setReservations(reservationDTOs);
        }

        return dto;
    }

    private ReservationResponseDTO mapReservationToResponseDto(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(reservation.getReservationID());
        dto.setStatus(reservation.getStatus());

        if (reservation.getClient() != null) {
            Client client = reservation.getClient();
            ClientDTO clientDTO = new ClientDTO();
            clientDTO.setId(client.getUserID());
            if (client.getProfile() != null) {
                clientDTO.setFirstName(client.getProfile().getFirstName());
                clientDTO.setLastName(client.getProfile().getLastName());
            }
            dto.setClient(clientDTO);
        }

        if (reservation.getTickets() != null) {
            dto.setTicketIds(reservation.getTickets().stream()
                    .map(Ticket::getTicketID)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}
