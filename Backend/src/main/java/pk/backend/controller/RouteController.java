package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.trip.Route;
import pk.backend.service.RouteService;
import pk.backend.dto.RouteDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/{routeId}")
    public Route getRouteById(@PathVariable Integer routeId) {
        return routeService.getRouteById(routeId);
    }

    @PostMapping("")
    public Route createRoute(@RequestBody RouteDTO routeDTO) {
        return routeService.createRoute(routeDTO);
    }

    @PutMapping("/{routeId}")
    public Route updateRoute(@PathVariable Integer routeId, @RequestBody RouteDTO routeDTO) {
        return routeService.updateRoute(routeId, routeDTO);
    }

    @DeleteMapping("/{routeId}")
    public void deleteRoute(@PathVariable Integer routeId) {
        routeService.deleteRoute(routeId);
    }
}

