package pk.backend.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.YearMonth;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationReportResponse {
    private String periodLabel;

    private long reservationsCount;
    private long seatsSold;
    private double revenue;
}


