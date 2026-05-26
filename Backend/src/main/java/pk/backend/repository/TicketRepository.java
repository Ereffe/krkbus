package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.reservation.Ticket;
import java.util.List;

/**
 * Repository for Ticket entity
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByReservationTripTripID(Integer tripID);
}

