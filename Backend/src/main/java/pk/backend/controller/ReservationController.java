package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.ReservationDTO;
import pk.backend.service.ReservationService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservationsDetailed());
    }

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservationDTO) {
        return ResponseEntity.ok(reservationService.createReservation(reservationDTO));
    }

    @PostMapping("/create")
    public ResponseEntity<ReservationDTO> createReservationByRouteAndDate(@RequestBody pk.backend.dto.ReservationCreateRequest request) {
        return ResponseEntity.ok(reservationService.createReservationByRouteAndDate(request));
    }


    @PostMapping("/{id}/cancel")
    public ResponseEntity<ReservationDTO> cancelReservation(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }
}


