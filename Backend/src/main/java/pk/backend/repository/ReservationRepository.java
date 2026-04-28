package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.reservation.Reservation;

/**
 * Repository for Reservation entity
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
}

