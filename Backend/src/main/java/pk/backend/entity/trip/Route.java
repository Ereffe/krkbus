package pk.backend.entity.trip;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.ArrayList;

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

        @ManyToMany(cascade = {
                        CascadeType.PERSIST,
                        CascadeType.MERGE
        })
        @JoinTable(name = "route_trip", joinColumns = @JoinColumn(name = "route_id"), inverseJoinColumns = @JoinColumn(name = "stop_id"))
        @OrderColumn(name = "stop_order")
        private List<Stop> stops = new ArrayList<>();
}
