package pk.backend.entity.user;

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
@PrimaryKeyJoinColumn(name = "userID")
public class Employee extends User {
    private Integer employeeNumber;
    private String position;

    @OneToMany(mappedBy = "employee")
    @JsonIgnoreProperties("employee")
    private Set<ScheduleEntry> scheduleEntries;

    @OneToMany(mappedBy = "driver")
    @JsonIgnoreProperties("driver")
    private Set<Trip> trips;
}

