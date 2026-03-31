package pk.backend.entity.trip;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.user.Employee;
import pk.backend.entity.reservation.Reservation;
import pk.backend.entity.vehicle.Vehicle;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tripID;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Float basePrice;
    private Integer availableSeats;

    @OneToMany(mappedBy = "trip")
    private Set<Reservation> reservations;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee driver;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
}
