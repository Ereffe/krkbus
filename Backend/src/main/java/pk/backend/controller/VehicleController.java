package pk.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.vehicle.Vehicle; // Twój pakiet Encji
import pk.backend.repository.VehicleRepository; // Twój pakiet Repozytorium

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*") // Zezwala na dostęp z Frontendu (localhost:5173)
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Obsługa GET (pobieranie listy do tabeli i dropdownów)
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    // Obsługa POST (dodawanie pojazdu z okienka dialogowego)
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }
}
