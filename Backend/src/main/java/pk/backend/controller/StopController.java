package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.trip.Stop;
import pk.backend.service.StopService;
import pk.backend.dto.StopDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stops")
public class StopController {

    private final StopService stopService;

    @GetMapping
    public List<Stop> getAllStops() {
        return stopService.getAllStops();
    }

    @GetMapping("/{stopId}")
    public Stop getStopById(@PathVariable Integer stopId) {
        return stopService.getStopById(stopId);
    }

    @PostMapping
    public Stop createStop(@RequestBody StopDTO stopDTO) {
        return stopService.createStop(stopDTO);
    }

    @PutMapping("/{stopId}")
    public Stop updateStop(@PathVariable Integer stopId, @RequestBody StopDTO stopDTO) {
        return stopService.updateStop(stopId, stopDTO);
    }

    @DeleteMapping("/{stopId}")
    public void deleteStop(@PathVariable Integer stopId) {
        stopService.deleteStop(stopId);
    }
}
