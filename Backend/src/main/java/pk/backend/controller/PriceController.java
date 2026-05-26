package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.trip.Price;
import pk.backend.service.PriceService;
import pk.backend.dto.PriceDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/prices")
@CrossOrigin(origins = "*")
public class PriceController {

    private final PriceService priceService;

    @GetMapping
    public List<Price> getAllPrices() {
        return priceService.getAllPrices();
    }

    @GetMapping("/{priceId}")
    public Price getPriceById(@PathVariable Integer priceId) {
        return priceService.getPriceById(priceId);
    }

    @PostMapping
    public Price createPrice(@RequestBody PriceDTO priceDTO) {
        return priceService.createPrice(priceDTO);
    }

    @PutMapping("/{priceId}")
    public Price updatePrice(@PathVariable Integer priceId, @RequestBody PriceDTO priceDTO) {
        return priceService.updatePrice(priceId, priceDTO);
    }

    @DeleteMapping("/{priceId}")
    public void deletePrice(@PathVariable Integer priceId) {
        priceService.deletePrice(priceId);
    }
}

