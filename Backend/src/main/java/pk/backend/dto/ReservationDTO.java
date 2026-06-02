package pk.backend.dto;

import lombok.*;
import pk.backend.entity.reservation.ReservationStatus;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Integer reservationID;
    private Integer tripID;
    private Integer clientID;
    private Integer seatCount;
    private Float totalPrice;
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime cancelledAt;
}

