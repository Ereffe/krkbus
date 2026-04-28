package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pk.backend.entity.trip.Route;
import pk.backend.repository.RouteRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}

