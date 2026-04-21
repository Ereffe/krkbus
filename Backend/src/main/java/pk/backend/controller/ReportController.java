package pk.backend.controller;

import org.springframework.web.bind.annotation.*;

/**
 * Controller for Secretary/Worker use cases
 * Handles administrative and system management operations using REST API CRUD operations
 */
@RestController
@RequestMapping("/api/worker")
public class ReportController {


    // ==================== Report Management ====================

    // TODO: Implement get all reports
    @GetMapping("/reports")
    public void getAllReports() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get report by ID
    @GetMapping("/reports/{reportId}")
    public void getReportById(@PathVariable Integer reportId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create report
    @PostMapping("/reports")
    public void createReport() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update report
    @PutMapping("/reports/{reportId}")
    public void updateReport(@PathVariable Integer reportId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete report
    @DeleteMapping("/reports/{reportId}")
    public void deleteReport(@PathVariable Integer reportId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

}





