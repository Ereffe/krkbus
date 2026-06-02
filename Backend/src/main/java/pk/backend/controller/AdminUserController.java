package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.auth.CreateEmployeeRequest;
import pk.backend.entity.user.Employee;
import pk.backend.entity.user.UserProfile;
import pk.backend.repository.EmployeeRepository;
import pk.backend.repository.UserProfileRepository;
import pk.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/employee")
    public ResponseEntity<?> createEmployee(@RequestBody CreateEmployeeRequest request) {
        if (userRepository.findByLogin(request.getLogin()).isPresent()) {
            return ResponseEntity.badRequest().body("Login already exists");
        }

        UserProfile profile = new UserProfile();
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        userProfileRepository.save(profile);

        Employee employee = new Employee();
        employee.setLogin(request.getLogin());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setRole(request.getRole()); // ADMIN, SECRETARY, DRIVER
        employee.setStatus("ACTIVE");
        employee.setProfile(profile);
        employee.setPosition(request.getPosition());

        employeeRepository.save(employee);

        return ResponseEntity.ok().build();
    }
}
