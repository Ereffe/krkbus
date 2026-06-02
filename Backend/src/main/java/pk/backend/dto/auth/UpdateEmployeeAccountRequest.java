package pk.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeAccountRequest {
    // ADMIN/SECRETARY/DRIVER
    private String role;

    // ACTIVE/INACTIVE
    private String status;

    private String position;

    // optional profile updates
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
}

