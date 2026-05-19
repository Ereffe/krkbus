package pk.backend.entity.trip;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Price {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer priceID;

    private Float normalTicket;
    private Float studentTicket;
    private Float seniorTicket;
    private Float dayPass;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
}

