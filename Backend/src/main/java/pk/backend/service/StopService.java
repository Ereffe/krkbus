package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.trip.Stop;
import pk.backend.entity.trip.Route;
import pk.backend.repository.StopRepository;
import pk.backend.repository.RouteRepository;
import pk.backend.dto.StopDTO;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StopService {

    private final StopRepository stopRepository;
    private final RouteRepository routeRepository;

    @Transactional(readOnly = true)
    public List<Stop> getAllStops() {
        return stopRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Stop getStopById(Integer id) {
        return stopRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stop with ID " + id + " not found"));
    }

    @Transactional
    public Stop createStop(StopDTO stopDTO) {
        Stop stop = new Stop();
        stop.setName(stopDTO.getName());
        stop.setLatitude(stopDTO.getLatitude());
        stop.setLongitude(stopDTO.getLongitude());

        return stopRepository.save(stop);
    }

    @Transactional
    public Stop updateStop(Integer id, StopDTO stopDTO) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stop with ID " + id + " not found"));
        stop.setName(stopDTO.getName());
        stop.setLatitude(stopDTO.getLatitude());
        stop.setLongitude(stopDTO.getLongitude());

        return stopRepository.save(stop);
    }

    @Transactional
    public void deleteStop(Integer id) {
        if (!stopRepository.existsById(id)) {
            throw new EntityNotFoundException("Stop with ID " + id + " not found");
        }
        stopRepository.deleteById(id);
    }
}
