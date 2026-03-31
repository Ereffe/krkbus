package pk.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.user.User;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logID;
    private String action;
    private String targetType;
    private Integer targetID;
    private LocalDateTime timestamp;
    private String details;
    private LocalDateTime createLogEntry;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
