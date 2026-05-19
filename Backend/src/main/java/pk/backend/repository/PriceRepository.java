package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.trip.Price;

@Repository
public interface PriceRepository extends JpaRepository<Price, Integer> {
}

