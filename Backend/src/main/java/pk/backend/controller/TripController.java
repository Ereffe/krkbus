package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.service.TripService;
import pk.backend.dto.TripDTO;
import pk.backend.dto.TripResponseDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;

    @GetMapping
    public List<TripResponseDTO> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{tripId}")
    public TripResponseDTO getTripById(@PathVariable Integer tripId) {
        return tripService.getTripById(tripId);
    }

    @PostMapping
    public TripResponseDTO createTrip(@RequestBody TripDTO tripDTO) {
        return tripService.createTrip(tripDTO);
    }

    @PutMapping("/{tripId}")
    public TripResponseDTO updateTrip(@PathVariable Integer tripId, @RequestBody TripDTO tripDTO) {
        return tripService.updateTrip(tripId, tripDTO);
    }

    @DeleteMapping("/{tripId}")
    public void deleteTrip(@PathVariable Integer tripId) {
        tripService.deleteTrip(tripId);
    }
}
