package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.dto.VehicleResponseDTO;
import pk.backend.entity.vehicle.Vehicle;
import pk.backend.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private VehicleResponseDTO mapToDto(Vehicle vehicle) {
        return new VehicleResponseDTO(
                vehicle.getVehicleID(),
                vehicle.getRegistrationNumber(),
                vehicle.getModel(),
                vehicle.getCapacity(),
                vehicle.getStatus(),
                vehicle.getParkingLocation()
        );
    }
}
