package pk.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class DriverController {

    // TODO: Implement get all drivers
    @GetMapping("/drivers")
    public void getAllDrivers() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get driver by ID
    @GetMapping("/drivers/{driverId}")
    public void getDriverById(@PathVariable Integer driverId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create driver
    @PostMapping("/drivers")
    public void createDriver() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update driver
    @PutMapping("/drivers/{driverId}")
    public void updateDriver(@PathVariable Integer driverId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete driver
    @DeleteMapping("/drivers/{driverId}")
    public void deleteDriver(@PathVariable Integer driverId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
