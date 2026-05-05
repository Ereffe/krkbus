package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.trip.Trip;
import pk.backend.entity.trip.Route;
import pk.backend.entity.user.Employee;
import pk.backend.entity.vehicle.Vehicle;
import pk.backend.repository.TripRepository;
import pk.backend.repository.RouteRepository;
import pk.backend.repository.EmployeeRepository;
import pk.backend.repository.VehicleRepository;
import pk.backend.dto.TripDTO;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TripService {

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final EmployeeRepository employeeRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Trip getTripById(Integer id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trip with ID " + id + " not found"));
    }

    @Transactional
    public Trip createTrip(TripDTO tripDTO) {
        Trip trip = new Trip();
        mapDtoToEntity(tripDTO, trip);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updateTrip(Integer id, TripDTO tripDTO) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trip with ID " + id + " not found"));
        mapDtoToEntity(tripDTO, trip);
        return tripRepository.save(trip);
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
}
