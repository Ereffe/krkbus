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
public class ReservationReportRequest {
    private LocalDate startDate;
    private LocalDate endDate;

    /**
     * monthly or yearly (wymaganie: raport miesięczny lub roczny)
     */
    private String aggregation;
}

