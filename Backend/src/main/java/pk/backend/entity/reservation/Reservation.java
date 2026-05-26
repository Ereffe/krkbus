package pk.backend.entity.reservation;

import jakarta.persistence.*;
import lombok.*;
import pk.backend.entity.trip.Trip;
import pk.backend.entity.user.Client;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reservationID;
    private Integer seatCount;
    
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime cancelledAt;
    private Float totalPrice;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    private Set<Ticket> tickets;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;
}

