package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.trip.Price;
import pk.backend.entity.trip.Route;
import pk.backend.repository.PriceRepository;
import pk.backend.repository.RouteRepository;
import pk.backend.dto.PriceDTO;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PriceService {

    private final PriceRepository priceRepository;
    private final RouteRepository routeRepository;

    @Transactional(readOnly = true)
    public List<Price> getAllPrices() {
        return priceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Price getPriceById(Integer id) {
        return priceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Price with ID " + id + " not found"));
    }

    @Transactional
    public Price createPrice(PriceDTO priceDTO) {
        Price price = new Price();
        price.setNormalTicket(priceDTO.getNormalTicket());
        price.setStudentTicket(priceDTO.getStudentTicket());
        price.setSeniorTicket(priceDTO.getSeniorTicket());
        price.setDayPass(priceDTO.getDayPass());

        if (priceDTO.getRouteId() != null) {
            Route route = routeRepository.findById(priceDTO.getRouteId())
                    .orElseThrow(() -> new EntityNotFoundException("Route with ID " + priceDTO.getRouteId() + " not found"));
            price.setRoute(route);
        }

        return priceRepository.save(price);
    }

    @Transactional
    public Price updatePrice(Integer id, PriceDTO priceDTO) {
        Price price = priceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Price with ID " + id + " not found"));

        price.setNormalTicket(priceDTO.getNormalTicket());
        price.setStudentTicket(priceDTO.getStudentTicket());
        price.setSeniorTicket(priceDTO.getSeniorTicket());
        price.setDayPass(priceDTO.getDayPass());

        if (priceDTO.getRouteId() != null) {
            Route route = routeRepository.findById(priceDTO.getRouteId())
                    .orElseThrow(() -> new EntityNotFoundException("Route with ID " + priceDTO.getRouteId() + " not found"));
            price.setRoute(route);
        } else {
            price.setRoute(null);
        }

        return priceRepository.save(price);
    }

    @Transactional
    public void deletePrice(Integer id) {
        if (!priceRepository.existsById(id)) {
            throw new EntityNotFoundException("Price with ID " + id + " not found");
        }
        priceRepository.deleteById(id);
    }
}

