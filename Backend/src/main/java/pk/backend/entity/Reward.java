package pk.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.user.Client;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rewardID;
    private String name;
    private Integer pointCost;
    private Integer availableQuantity;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}
