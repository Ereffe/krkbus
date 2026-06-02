package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.Report;
import pk.backend.service.ReportService;
import pk.backend.dto.ReportDTO;

import java.util.List;

/**
 * Controller for Worker use cases
 * Handles report management operations using REST API CRUD operations
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    // ==================== Report Management ====================

    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{reportId}")
    public Report getReportById(@PathVariable Integer reportId) {
        return reportService.getReportById(reportId);
    }

    @PostMapping
    public Report createReport(@RequestBody ReportDTO reportDTO) {
        return reportService.createReport(reportDTO);
    }

    @PutMapping("/{reportId}")
    public Report updateReport(@PathVariable Integer reportId, @RequestBody ReportDTO reportDTO) {
        return reportService.updateReport(reportId, reportDTO);
    }

    @DeleteMapping("/{reportId}")
    public void deleteReport(@PathVariable Integer reportId) {
        reportService.deleteReport(reportId);
    }

}





