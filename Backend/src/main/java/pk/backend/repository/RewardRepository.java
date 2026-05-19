package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.Reward;

/**
 * Repository for Reward entity
 */
@Repository
public interface RewardRepository extends JpaRepository<Reward, Integer> {
}
