package pk.backend.entity.user;

import lombok.*;
import jakarta.persistence.Embeddable;

/**
 * Embeddable class for user personal information.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
}

