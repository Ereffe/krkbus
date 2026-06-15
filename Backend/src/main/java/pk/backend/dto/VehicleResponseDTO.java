package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponseDTO {
    private Integer vehicleID;
    private String registrationNumber;
    private String model;
    private Integer capacity;
    private String status;
    private String parkingLocation;
}
