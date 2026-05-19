package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.user.ScheduleEntry;
import pk.backend.service.ScheduleService;
import pk.backend.dto.ScheduleEntryDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    // ==================== Schedule Management ====================

    @GetMapping
    public List<ScheduleEntry> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{scheduleId}")
    public ScheduleEntry getScheduleById(@PathVariable Integer scheduleId) {
        return scheduleService.getScheduleById(scheduleId);
    }

    @PostMapping
    public ScheduleEntry createSchedule(@RequestBody ScheduleEntryDTO scheduleEntryDTO) {
        return scheduleService.createSchedule(scheduleEntryDTO);
    }

    @PutMapping("/{scheduleId}")
    public ScheduleEntry updateSchedule(@PathVariable Integer scheduleId, @RequestBody ScheduleEntryDTO scheduleEntryDTO) {
        return scheduleService.updateSchedule(scheduleId, scheduleEntryDTO);
    }

    @DeleteMapping("/{scheduleId}")
    public void deleteSchedule(@PathVariable Integer scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
    }
}
