package pk.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class ScheduleController {


    // ==================== Schedule Management ====================

    // TODO: Implement get all schedules
    @GetMapping("/schedules")
    public void getAllSchedules() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get schedule by ID
    @GetMapping("/schedules/{scheduleId}")
    public void getScheduleById(@PathVariable Integer scheduleId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create schedule
    @PostMapping("/schedules")
    public void createSchedule() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update schedule
    @PutMapping("/schedules/{scheduleId}")
    public void updateSchedule(@PathVariable Integer scheduleId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete schedule
    @DeleteMapping("/schedules/{scheduleId}")
    public void deleteSchedule(@PathVariable Integer scheduleId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
