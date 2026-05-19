package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleEntryDTO {
    private LocalDate date;
    private LocalTime shiftStartTime;
    private LocalTime shiftEndTime;
    private Integer employeeId;
    private Integer tripId;
}
