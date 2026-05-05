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
public class RouteController {

    private final RouteService routeService;

    // ==================== Route Management ====================

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/routes/{routeId}")
    public Route getRouteById(@PathVariable Integer routeId) {
        return routeService.getRouteById(routeId);
    }

    @PostMapping("/routes")
    public Route createRoute(@RequestBody RouteDTO routeDTO) {
        return routeService.createRoute(routeDTO);
    }

    @PutMapping("/routes/{routeId}")
    public Route updateRoute(@PathVariable Integer routeId, @RequestBody RouteDTO routeDTO) {
        return routeService.updateRoute(routeId, routeDTO);
    }

    @DeleteMapping("/routes/{routeId}")
    public void deleteRoute(@PathVariable Integer routeId) {
        routeService.deleteRoute(routeId);
    }

    // ==================== Price Management ====================

    // TODO: Implement get all prices
    @GetMapping("/prices")
    public void getAllPrices() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get price by ID
    @GetMapping("/prices/{priceId}")
    public void getPriceById(@PathVariable Integer priceId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create price
    @PostMapping("/prices")
    public void createPrice() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update price
    @PutMapping("/prices/{priceId}")
    public void updatePrice(@PathVariable Integer priceId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete price
    @DeleteMapping("/prices/{priceId}")
    public void deletePrice(@PathVariable Integer priceId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
