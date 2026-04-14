package pk.backend.entity.user;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.AuditLog;

import java.util.Set;

/**
 * Abstract base class for all user types in the system.
 * Serves as the parent entity for Client and Employee subclasses.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;
    
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    private String login;
    private String password;
    private String role;
    private String status;

    @OneToMany(mappedBy = "user")
    private Set<AuditLog> auditLogs;
}
