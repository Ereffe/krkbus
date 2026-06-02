package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.reports.CourseReportRequest;
import pk.backend.dto.reports.CourseReportResponse;
import pk.backend.service.report.CourseReportService;

import java.nio.charset.StandardCharsets;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner/secretary/reports/courses")
public class CourseReportController {

    private final CourseReportService courseReportService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','SECRETARY')")
    public List<CourseReportResponse> generate(@RequestBody CourseReportRequest request) {
        return courseReportService.generate(request);
    }

    @PostMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ADMIN','SECRETARY')")
    public ResponseEntity<byte[]> exportCsv(@RequestBody CourseReportRequest request) {
        List<CourseReportResponse> rows = courseReportService.generate(request);

        // Flatten passengersByStops into multiple rows per period.
        StringBuilder sb = new StringBuilder();
        sb.append("periodLabel,revenue,fuelCost,profit,segmentLabel,passengers\n");

        for (CourseReportResponse r : rows) {
            if (r.getPassengersByStops() == null || r.getPassengersByStops().isEmpty()) {
                sb.append(csvEscape(r.getPeriodLabel())).append(",")
                        .append(r.getRevenue()).append(",")
                        .append(r.getFuelCost()).append(",")
                        .append(r.getProfit()).append(",")
                        .append("\"").append("\"").append(",")
                        .append("0")
                        .append("\n");
                continue;
            }

            for (var seg : r.getPassengersByStops()) {
                sb.append(csvEscape(r.getPeriodLabel())).append(",")
                        .append(r.getRevenue()).append(",")
                        .append(r.getFuelCost()).append(",")
                        .append(r.getProfit()).append(",")
                        .append(csvEscape(seg.getSegmentLabel())).append(",")
                        .append(seg.getPassengers())
                        .append("\n");
            }
        }

        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=utf-8"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=raport_kursy_" + request.getAggregation() + ".csv");
        headers.setContentLength(bytes.length);
        return ResponseEntity.ok().headers(headers).body(bytes);
    }

    private static String csvEscape(String s) {
        if (s == null) return "";
        boolean needsQuotes = s.contains(",") || s.contains("\n") || s.contains("\r") || s.contains("\"");
        String v = s.replace("\"", "\"\"");
        return needsQuotes ? "\"" + v + "\"" : v;
    }
}

