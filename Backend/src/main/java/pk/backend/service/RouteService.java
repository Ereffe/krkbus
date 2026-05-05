package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.trip.Route;
import pk.backend.entity.trip.Stop;
import pk.backend.repository.RouteRepository;
import pk.backend.repository.StopRepository;
import pk.backend.dto.RouteDTO;

import jakarta.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;

    @Transactional(readOnly = true)
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Route getRouteById(Integer id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Route with ID " + id + " not found"));
    }

    @Transactional
    public Route createRoute(RouteDTO routeDTO) {
        Route route = new Route();
        route.setName(routeDTO.getName());
        route.setDescription(routeDTO.getDescription());
        route.setStops(fetchAndValidateStops(routeDTO.getStopIds()));
        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Integer id, RouteDTO routeDTO) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Route with ID " + id + " not found"));
        route.setName(routeDTO.getName());
        route.setDescription(routeDTO.getDescription());
        route.setStops(fetchAndValidateStops(routeDTO.getStopIds()));
        return routeRepository.save(route);
    }

    private Set<Stop> fetchAndValidateStops(List<Integer> stopIds) {
        if (stopIds == null || stopIds.isEmpty()) {
            return new HashSet<>();
        }
        List<Stop> stops = stopRepository.findAllById(stopIds);
        if (stops.size() != stopIds.size()) {
            throw new IllegalArgumentException("One or more stops provided do not exist.");
        }
        return new HashSet<>(stops);
    }

    @Transactional
    public void deleteRoute(Integer id) {
        if (!routeRepository.existsById(id)) {
            throw new EntityNotFoundException("Route with ID " + id + " not found");
        }
        routeRepository.deleteById(id);
    }
}
