package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.vehicle.FuelRecord;

/**
 * Repository for FuelRecord entity
 */
@Repository
public interface FuelRecordRepository extends JpaRepository<FuelRecord, Integer> {
}

