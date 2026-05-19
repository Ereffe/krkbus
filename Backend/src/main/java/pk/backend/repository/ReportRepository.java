package pk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pk.backend.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
}
