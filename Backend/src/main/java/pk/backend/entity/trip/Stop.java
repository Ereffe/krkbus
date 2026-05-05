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
    private Double latitude;
    private Double longitude;
}
