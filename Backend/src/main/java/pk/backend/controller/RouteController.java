package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.trip.Route;
import pk.backend.service.RouteService;

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

    // TODO: Implement get route by ID
    @GetMapping("/routes/{routeId}")
    public void getRouteById(@PathVariable Integer routeId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create route
    @PostMapping("/routes")
    public void createRoute() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update route
    @PutMapping("/routes/{routeId}")
    public void updateRoute(@PathVariable Integer routeId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete route
    @DeleteMapping("/routes/{routeId}")
    public void deleteRoute(@PathVariable Integer routeId) {
        throw new UnsupportedOperationException("Not implemented yet");
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
