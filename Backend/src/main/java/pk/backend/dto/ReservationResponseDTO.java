package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pk.backend.entity.reservation.ReservationStatus;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDTO {
    private Integer id;
    private ClientDTO client;
    private ReservationStatus status;
    private Set<Integer> ticketIds;

}
