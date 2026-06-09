package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.auth.EmployeeAccountDTO;
import pk.backend.dto.auth.UpdateEmployeeAccountRequest;
import pk.backend.service.AdminEmployeeAccountService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminEmployeeAccountController {

    private final AdminEmployeeAccountService adminEmployeeAccountService;

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeAccountDTO>> getAllEmployees() {
        return ResponseEntity.ok(adminEmployeeAccountService.getAllEmployeesAccounts());
    }

    @PutMapping("/employees/{employeeId}")
    public ResponseEntity<EmployeeAccountDTO> updateEmployee(
            @PathVariable Integer employeeId,
            @RequestBody UpdateEmployeeAccountRequest request
    ) {
        return ResponseEntity.ok(adminEmployeeAccountService.updateEmployeeAccount(employeeId, request));
    }

    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Integer employeeId) {
        adminEmployeeAccountService.deleteEmployeeAccount(employeeId);
        return ResponseEntity.noContent().build();
    }
}

