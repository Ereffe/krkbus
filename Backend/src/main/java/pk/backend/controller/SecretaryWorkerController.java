package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.user.Employee;
import pk.backend.service.EmployeeService;
import pk.backend.dto.EmployeeDTO;

import java.util.List;

/**
 * Controller for Owner/Manager use cases
 * Handles owner operations using REST API CRUD operations
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner")
public class SecretaryWorkerController {

    private final EmployeeService employeeService;
    private static final String POSITION = "Secretary";

    // ==================== Secretary Worker Management ====================

    @GetMapping("/workers/secretary")
    public List<Employee> getAllSecretaryWorkers() {
        return employeeService.getAllEmployeesByPosition(POSITION);
    }

    @GetMapping("/workers/secretary/{workerId}")
    public Employee getSecretaryWorkerById(@PathVariable Integer workerId) {
        return employeeService.getEmployeeByIdAndPosition(workerId, POSITION);
    }

    @PostMapping("/workers/secretary")
    public Employee createSecretaryWorker(@RequestBody EmployeeDTO employeeDTO) {
        return employeeService.createEmployee(employeeDTO, POSITION);
    }

    @PutMapping("/workers/secretary/{workerId}")
    public Employee updateSecretaryWorker(@PathVariable Integer workerId, @RequestBody EmployeeDTO employeeDTO) {
        return employeeService.updateEmployee(workerId, employeeDTO, POSITION);
    }

    @DeleteMapping("/workers/secretary/{workerId}")
    public void deleteSecretaryWorker(@PathVariable Integer workerId) {
        employeeService.deleteEmployee(workerId, POSITION);
    }

    @PutMapping("/workers/secretary/{workerId}/schedule")
    public void updateSecretaryWorkerSchedule(@PathVariable Integer workerId) {
        // Assume this calls ScheduleService or just acknowledge implementation
        // Real implementation would link to ScheduleEntry creation/updates
        throw new UnsupportedOperationException("Not implemented yet - complex schedule linking");
    }

}


