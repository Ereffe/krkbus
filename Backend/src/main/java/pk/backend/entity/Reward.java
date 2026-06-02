package pk.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.user.Client;
import java.util.Set;

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
    private String description;
    private Integer availableQuantity;

    @ManyToMany(mappedBy = "rewards")
    private Set<Client> clients;
}

