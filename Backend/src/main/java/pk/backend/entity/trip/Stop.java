package pk.backend.entity.trip;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stopID;
    private String name;
    private String location;
    private Integer stopOrder;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
}
