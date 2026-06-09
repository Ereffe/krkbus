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
@PrimaryKeyJoinColumn(name = "userID")
public class Employee extends User {
    private Integer employeeNumber;
    private String position;

    @OneToMany(mappedBy = "employee")
    private Set<ScheduleEntry> scheduleEntries;

    @OneToMany(mappedBy = "driver")
    private Set<Trip> trips;
}

