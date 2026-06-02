package pk.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateEmployeeRequest {
    private String login;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role; // ADMIN, SECRETARY, DRIVER
    private String position; // e.g. "Kierowca", "Sekretarka", "Właściciel"
}
