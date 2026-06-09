package pk.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pk.backend.entity.user.Employee;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAccountDTO {
    private Integer id;
    private String login;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    // ADMIN/SECRETARY/DRIVER
    private String role;

    // ACTIVE/INACTIVE
    private String status;

    // e.g. "Kierowca", "Sekretarka", "Właściciel"
    private String position;

    public static EmployeeAccountDTO fromEntity(Employee e) {
        if (e == null) return null;
        return EmployeeAccountDTO.builder()
                .id(e.getUserID())
                .login(e.getLogin())
                .firstName(e.getProfile() != null ? e.getProfile().getFirstName() : null)
                .lastName(e.getProfile() != null ? e.getProfile().getLastName() : null)
                .email(e.getProfile() != null ? e.getProfile().getEmail() : null)
                .phone(e.getProfile() != null ? e.getProfile().getPhone() : null)
                .role(e.getRole())
                .status(e.getStatus())
                .position(e.getPosition())
                .build();
    }
}

