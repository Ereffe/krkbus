package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDTO {
    private Integer tripID;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Float basePrice;
    private Integer availableSeats;
    private Set<ReservationResponseDTO> reservations;
    private Integer vehicleId;
    private Integer driverId;
    private Integer routeId;
}
