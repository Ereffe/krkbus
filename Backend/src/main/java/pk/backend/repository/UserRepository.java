package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.user.User;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}

