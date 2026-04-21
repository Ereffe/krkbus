package pk.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class StopController {

    // TODO: Implement get all stops
    @GetMapping("/stops")
    public void getAllStops() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get stop by ID
    @GetMapping("/stops/{stopId}")
    public void getStopById(@PathVariable Integer stopId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create stop
    @PostMapping("/stops")
    public void createStop() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update stop
    @PutMapping("/stops/{stopId}")
    public void updateStop(@PathVariable Integer stopId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete stop
    @DeleteMapping("/stops/{stopId}")
    public void deleteStop(@PathVariable Integer stopId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
