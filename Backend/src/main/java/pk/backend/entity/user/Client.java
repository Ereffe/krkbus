package pk.backend.entity.user;

import lombok.*;
import jakarta.persistence.*;
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

    @ManyToMany
    @JoinTable(
        name = "client_reward",
        joinColumns = @JoinColumn(name = "client_id"),
        inverseJoinColumns = @JoinColumn(name = "reward_id")
    )
    private Set<Reward> rewards;
}

