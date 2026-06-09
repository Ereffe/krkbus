package pk.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import pk.backend.entity.user.Employee;
import pk.backend.entity.user.UserProfile;
import pk.backend.repository.EmployeeRepository;
import pk.backend.repository.UserProfileRepository;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class BootstrapAdminData {

    /**
     * Dev seed: creates an ADMIN employee on startup if it doesn't exist.
     * This prevents initial setup being blocked by 403 on /api/admin/**.
     */
    @Bean
    public CommandLineRunner seedAdmin(
            PasswordEncoder passwordEncoder,
            EmployeeRepository employeeRepository,
            UserProfileRepository userProfileRepository
    ) {
        return args -> {
            String adminLogin = "admin";

            boolean exists = employeeRepository.findAll().stream()
                    .anyMatch(e -> adminLogin.equalsIgnoreCase(e.getLogin()));

            if (exists) {
                return;
            }

            UserProfile profile = new UserProfile();
            profile.setFirstName("Admin");
            profile.setLastName("Root");
            profile.setDateOfBirth(LocalDate.of(1990, 1, 1));
            profile.setEmail("admin@example.com");
            profile.setPhone("+48123123123");
            userProfileRepository.save(profile);

            Employee admin = new Employee();
            admin.setLogin(adminLogin);
            admin.setPassword(passwordEncoder.encode("AdminPass123!"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            admin.setProfile(profile);
            admin.setPosition("Właściciel");

            employeeRepository.save(admin);
        };
    }
}

