package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.dto.auth.EmployeeAccountDTO;
import pk.backend.dto.auth.UpdateEmployeeAccountRequest;
import pk.backend.entity.user.Employee;
import pk.backend.entity.user.UserProfile;
import pk.backend.repository.EmployeeRepository;

import jakarta.persistence.EntityNotFoundException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminEmployeeAccountService {

    private final EmployeeRepository employeeRepository;

    private static final Set<String> ALLOWED_ROLES = Set.of("ADMIN", "SECRETARY", "DRIVER");

    @Transactional(readOnly = true)
    public List<EmployeeAccountDTO> getAllEmployeesAccounts() {
        // repo currently has no role filtering, so filter here
        return employeeRepository.findAll().stream()
                .filter(this::isAllowedEmployeeRole)
                .map(EmployeeAccountDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeAccountDTO updateEmployeeAccount(Integer employeeId, UpdateEmployeeAccountRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee with ID " + employeeId + " not found"));

        if (!isAllowedEmployeeRole(employee)) {
            throw new IllegalArgumentException("Only employee accounts can be updated");
        }

        if (request.getRole() != null) {
            String role = normalizeRole(request.getRole());
            employee.setRole(role);
        }

        if (request.getStatus() != null) {
            String status = normalizeStatus(request.getStatus());
            employee.setStatus(status);
        }

        if (request.getPosition() != null) {
            employee.setPosition(request.getPosition());
        }

        // profile updates
        if (request.getFirstName() != null || request.getLastName() != null ||
                request.getEmail() != null || request.getPhone() != null) {
            UserProfile profile = employee.getProfile();
            if (profile == null) {
                profile = new UserProfile();
                employee.setProfile(profile);
            }

            if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
            if (request.getLastName() != null) profile.setLastName(request.getLastName());
            if (request.getEmail() != null) profile.setEmail(request.getEmail());
            if (request.getPhone() != null) profile.setPhone(request.getPhone());
        }

        Employee saved = employeeRepository.save(employee);
        return EmployeeAccountDTO.fromEntity(saved);
    }

    @Transactional
    public void deleteEmployeeAccount(Integer employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee with ID " + employeeId + " not found"));

        if (!isAllowedEmployeeRole(employee)) {
            throw new IllegalArgumentException("Only employee accounts can be deleted");
        }

        employeeRepository.delete(employee);
    }

    private boolean isAllowedEmployeeRole(Employee e) {
        if (e == null || e.getRole() == null) return false;
        return ALLOWED_ROLES.contains(e.getRole().toUpperCase(Locale.ROOT));
    }

    private String normalizeRole(String role) {
        String r = role.toUpperCase(Locale.ROOT);
        if (!ALLOWED_ROLES.contains(r)) {
            throw new IllegalArgumentException("Role must be one of: " + ALLOWED_ROLES);
        }
        return r;
    }

    private String normalizeStatus(String status) {
        String s = status.toUpperCase(Locale.ROOT);
        if (!Arrays.asList("ACTIVE", "INACTIVE").contains(s)) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }
        return s;
    }
}

