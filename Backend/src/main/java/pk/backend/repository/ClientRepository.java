package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.user.Client;

/**
 * Repository for Client entity
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
}

