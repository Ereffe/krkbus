package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

import pk.backend.dto.reports.ReservationReportRequest;
import pk.backend.dto.reports.ReservationReportResponse;
import pk.backend.service.report.ReservationReportService;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner/secretary/reports/reservations")
public class ReservationReportController {

    private final ReservationReportService reservationReportService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','SECRETARY')")
    public List<ReservationReportResponse> generate(@RequestBody ReservationReportRequest request) {
        return reservationReportService.generate(request);
    }

    @PostMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ADMIN','SECRETARY')")
    public ResponseEntity<byte[]> exportCsv(@RequestBody ReservationReportRequest request) {
        List<ReservationReportResponse> rows = reservationReportService.generate(request);

        StringBuilder sb = new StringBuilder();
        sb.append("periodLabel,reservationsCount,seatsSold,revenue\n");
        for (ReservationReportResponse r : rows) {
            sb.append(csvEscape(r.getPeriodLabel())).append(",")
                    .append(r.getReservationsCount()).append(",")
                    .append(r.getSeatsSold()).append(",")
                    .append(r.getRevenue())
                    .append("\n");
        }

        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=utf-8"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=raport_rezerwacje_" + request.getAggregation() + ".csv");
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

