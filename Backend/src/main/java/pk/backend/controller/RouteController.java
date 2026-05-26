package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.trip.Route;
import pk.backend.entity.trip.Price;
import pk.backend.service.RouteService;
import pk.backend.service.PriceService;
import pk.backend.dto.RouteDTO;
import pk.backend.dto.PriceDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;
    private final PriceService priceService;

    // ==================== Route Management ====================

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

    // ==================== Price Management ====================

    @GetMapping("/prices")
    public List<Price> getAllPrices() {
        return priceService.getAllPrices();
    }

    @GetMapping("/prices/{priceId}")
    public Price getPriceById(@PathVariable Integer priceId) {
        return priceService.getPriceById(priceId);
    }

    @PostMapping("/prices")
    public Price createPrice(@RequestBody PriceDTO priceDTO) {
        return priceService.createPrice(priceDTO);
    }

    @PutMapping("/prices/{priceId}")
    public Price updatePrice(@PathVariable Integer priceId, @RequestBody PriceDTO priceDTO) {
        return priceService.updatePrice(priceId, priceDTO);
    }

    @DeleteMapping("/prices/{priceId}")
    public void deletePrice(@PathVariable Integer priceId) {
        priceService.deletePrice(priceId);
    }
}
