package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCreateRequest {
    /** Data rezerwacji (bez czasu) */
    private LocalDate reservationDate;

    /** Liczba miejsc */
    private Integer seatCount;

    /** Trasa (routeID) */
    private Integer routeID;
}

