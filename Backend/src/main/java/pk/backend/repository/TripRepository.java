package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.trip.Trip;

/**
 * Repository for Trip entity
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {
}

