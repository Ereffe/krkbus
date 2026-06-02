package pk.backend.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseReportRequest {

    private LocalDate startDate;
    private LocalDate endDate;

    /**
     * daily/weekly/monthly/yearly
     */
    private String aggregation;

    // optional filters
    private Integer vehicleId;
    private Integer driverId;
}


