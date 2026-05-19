package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.Report;
import pk.backend.repository.ReportRepository;
import pk.backend.dto.ReportDTO;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Report getReportById(Integer id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Report with ID " + id + " not found"));
    }

    @Transactional
    public Report createReport(ReportDTO dto) {
        Report report = new Report();
        report.setTitle(dto.getTitle());
        report.setContent(dto.getContent());
        report.setGeneratedAt(dto.getGeneratedAt());
        return reportRepository.save(report);
    }

    @Transactional
    public Report updateReport(Integer id, ReportDTO dto) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Report with ID " + id + " not found"));
        report.setTitle(dto.getTitle());
        report.setContent(dto.getContent());
        report.setGeneratedAt(dto.getGeneratedAt());
        return reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Integer id) {
        if (!reportRepository.existsById(id)) {
            throw new EntityNotFoundException("Report with ID " + id + " not found");
        }
        reportRepository.deleteById(id);
    }
}
