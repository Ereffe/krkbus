package pk.backend.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseReportResponse {

    private String periodLabel;

    // closest to requirement given current model
    private List<PassengersByStopSegment> passengersByStops;

    private double revenue;
    private double fuelCost;
    private double profit;
}


