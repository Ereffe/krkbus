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
import java.util.ArrayList;

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

    private List<Stop> fetchAndValidateStops(List<Integer> stopIds) {
        if (stopIds == null || stopIds.isEmpty()) {
            return new ArrayList<>();
        }

        Set<Integer> uniqueIds = new HashSet<>(stopIds);
        List<Stop> uniqueStops = stopRepository.findAllById(uniqueIds);

        if (uniqueStops.size() != uniqueIds.size()) {
            throw new IllegalArgumentException("One or more stops provided do not exist.");
        }

        java.util.Map<Integer, Stop> stopMap = uniqueStops.stream()
                .collect(java.util.stream.Collectors.toMap(Stop::getStopID, stop -> stop));

        List<Stop> orderedStops = new ArrayList<>();
        for (Integer id : stopIds) {
            orderedStops.add(stopMap.get(id));
        }

        return orderedStops;
    }

    @Transactional
    public void deleteRoute(Integer id) {
        if (!routeRepository.existsById(id)) {
            throw new EntityNotFoundException("Route with ID " + id + " not found");
        }
        routeRepository.deleteById(id);
    }
}
