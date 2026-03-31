package pk.backend.entity.reservation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ticketID;
    private Integer seatNumber;
    private Float price;
    private String status;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
}
