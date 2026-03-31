package pk.backend.entity.user;

import lombok.*;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import pk.backend.entity.reservation.Reservation;
import pk.backend.entity.Reward;

import java.time.LocalDate;
import java.util.Set;

/**
 * Client entity representing a customer in the system.
 * Extends the abstract User class with client-specific attributes.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "userID")
public class Client extends User {
    private String clientNumber;
    private Integer loyaltyPoints;
    private LocalDate blockedUntilDate;

    @OneToMany(mappedBy = "client")
    private Set<Reservation> reservations;

    @OneToMany(mappedBy = "client")
    private Set<Reward> rewards;
}
