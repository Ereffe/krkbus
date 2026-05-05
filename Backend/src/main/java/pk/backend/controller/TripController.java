package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.trip.Trip;
import pk.backend.service.TripService;
import pk.backend.dto.TripDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{tripId}")
    public Trip getTripById(@PathVariable Integer tripId) {
        return tripService.getTripById(tripId);
    }

    @PostMapping
    public Trip createTrip(@RequestBody TripDTO tripDTO) {
        return tripService.createTrip(tripDTO);
    }

    @PutMapping("/{tripId}")
    public Trip updateTrip(@PathVariable Integer tripId, @RequestBody TripDTO tripDTO) {
        return tripService.updateTrip(tripId, tripDTO);
    }

    @DeleteMapping("/{tripId}")
    public void deleteTrip(@PathVariable Integer tripId) {
        tripService.deleteTrip(tripId);
    }
}
