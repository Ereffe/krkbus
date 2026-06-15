package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.VehicleResponseDTO;
import pk.backend.entity.vehicle.Vehicle;
import pk.backend.repository.VehicleRepository;
import pk.backend.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleRepository vehicleRepository;

    @GetMapping
    public ResponseEntity<List<VehicleResponseDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }
}
