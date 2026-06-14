package pk.backend.entity.user;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.trip.Trip;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleID;
    private LocalDate date;
    private LocalTime shiftStartTime;
    private LocalTime shiftEndTime;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"scheduleEntries", "trips"})
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonIgnoreProperties({"driver", "reservations"})
    private Trip trip;
}

