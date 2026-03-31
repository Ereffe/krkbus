package pk.backend.entity.trip;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer routeID;
    private String name;
    private String description;

    @OneToMany(mappedBy = "route")
    private Set<Trip> trips;

    @OneToMany(mappedBy = "route")
    private Set<Stop> stops;
}
