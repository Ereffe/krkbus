package pk.backend.entity.user;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.trip.Trip;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeNumber;
    private String position;

    @OneToMany(mappedBy = "employee")
    private Set<ScheduleEntry> scheduleEntries;

    @OneToMany(mappedBy = "driver")
    private Set<Trip> trips;
}
