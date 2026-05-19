package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.user.Employee;
import pk.backend.service.EmployeeService;
import pk.backend.dto.EmployeeDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drivers")
public class DriverController {

    private final EmployeeService employeeService;
    private static final String POSITION = "Driver";

    @GetMapping
    public List<Employee> getAllDrivers() {
        return employeeService.getAllEmployeesByPosition(POSITION);
    }

    @GetMapping("/{driverId}")
    public Employee getDriverById(@PathVariable Integer driverId) {
        return employeeService.getEmployeeByIdAndPosition(driverId, POSITION);
    }

    @PostMapping
    public Employee createDriver(@RequestBody EmployeeDTO employeeDTO) {
        return employeeService.createEmployee(employeeDTO, POSITION);
    }

    @PutMapping("/{driverId}")
    public Employee updateDriver(@PathVariable Integer driverId, @RequestBody EmployeeDTO employeeDTO) {
        return employeeService.updateEmployee(driverId, employeeDTO, POSITION);
    }

    @DeleteMapping("/{driverId}")
    public void deleteDriver(@PathVariable Integer driverId) {
        employeeService.deleteEmployee(driverId, POSITION);
    }
}
