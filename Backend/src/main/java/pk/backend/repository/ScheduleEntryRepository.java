package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.user.ScheduleEntry;

/**
 * Repository for ScheduleEntry entity
 */
@Repository
public interface ScheduleEntryRepository extends JpaRepository<ScheduleEntry, Integer> {
}
