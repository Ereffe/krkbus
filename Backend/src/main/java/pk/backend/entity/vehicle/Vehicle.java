package pk.backend.entity.vehicle;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.trip.Trip;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer vehicleID;
    private String registrationNumber;
    private String model;
    private Integer capacity;
    private String status;
    private String parkingLocation;

    @OneToMany(mappedBy = "vehicle")
    @JsonIgnoreProperties("vehicle")
    private Set<Trip> trips;

    @OneToMany(mappedBy = "vehicle")
    @JsonIgnoreProperties("vehicle")
    private Set<FuelRecord> fuelRecords;
}
