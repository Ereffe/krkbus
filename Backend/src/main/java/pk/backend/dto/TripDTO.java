package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripDTO {
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Float basePrice;
    private Integer availableSeats;
    private Integer vehicleId;
    private Integer driverId;
    private Integer routeId;
}
