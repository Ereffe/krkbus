package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.service.EmployeeService;
import pk.backend.dto.EmployeeDTO;
import pk.backend.dto.DriverResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drivers")
public class DriverController {

    private final EmployeeService employeeService;
    private static final String POSITION = "Driver";

    @GetMapping
    public List<DriverResponseDTO> getAllDrivers() {
        return employeeService.getAllEmployeesByPosition(POSITION).stream()
                .map(e -> {
                    String firstName = e.getProfile() != null ? e.getProfile().getFirstName() : null;
                    String lastName = e.getProfile() != null ? e.getProfile().getLastName() : null;
                    return new DriverResponseDTO(e.getUserID(), firstName, lastName, e.getPosition());
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{driverId}")
    public DriverResponseDTO getDriverById(@PathVariable Integer driverId) {
        var e = employeeService.getEmployeeByIdAndPosition(driverId, POSITION);
        String firstName = e.getProfile() != null ? e.getProfile().getFirstName() : null;
        String lastName = e.getProfile() != null ? e.getProfile().getLastName() : null;
        return new DriverResponseDTO(e.getUserID(), firstName, lastName, e.getPosition());
    }

    @PostMapping
    public DriverResponseDTO createDriver(@RequestBody EmployeeDTO employeeDTO) {
        var e = employeeService.createEmployee(employeeDTO, POSITION);
        String firstName = e.getProfile() != null ? e.getProfile().getFirstName() : null;
        String lastName = e.getProfile() != null ? e.getProfile().getLastName() : null;
        return new DriverResponseDTO(e.getUserID(), firstName, lastName, e.getPosition());
    }

    @PutMapping("/{driverId}")
    public DriverResponseDTO updateDriver(@PathVariable Integer driverId, @RequestBody EmployeeDTO employeeDTO) {
        var e = employeeService.updateEmployee(driverId, employeeDTO, POSITION);
        String firstName = e.getProfile() != null ? e.getProfile().getFirstName() : null;
        String lastName = e.getProfile() != null ? e.getProfile().getLastName() : null;
        return new DriverResponseDTO(e.getUserID(), firstName, lastName, e.getPosition());
    }

    @DeleteMapping("/{driverId}")
    public void deleteDriver(@PathVariable Integer driverId) {
        employeeService.deleteEmployee(driverId, POSITION);
    }
}
