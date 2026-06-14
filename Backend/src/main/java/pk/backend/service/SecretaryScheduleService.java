package pk.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.dto.SecretaryScheduleRangeRequest;
import pk.backend.entity.user.Employee;
import pk.backend.entity.user.ScheduleEntry;
import pk.backend.repository.EmployeeRepository;
import pk.backend.repository.ScheduleEntryRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecretaryScheduleService {

    private final EmployeeRepository employeeRepository;
    private final ScheduleEntryRepository scheduleEntryRepository;

    @Transactional
    public void upsertSecretarySchedule(Integer secretaryEmployeeNumber, SecretaryScheduleRangeRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.getFromDate() == null || request.getToDate() == null) {
            throw new IllegalArgumentException("fromDate and toDate are required");
        }
        if (request.getShiftStartTime() == null || request.getShiftEndTime() == null) {
            throw new IllegalArgumentException("shiftStartTime and shiftEndTime are required");
        }

        if (request.getFromDate().isAfter(request.getToDate())) {
            throw new IllegalArgumentException("fromDate must be <= toDate");
        }

        Employee secretary = employeeRepository.findById(secretaryEmployeeNumber)
                .orElseThrow(() -> new EntityNotFoundException("Secretary not found"));

        List<LocalDate> dates = request.getFromDate().datesUntil(request.getToDate().plusDays(1)).toList();

        for (LocalDate date : dates) {
            Optional<ScheduleEntry> existing = scheduleEntryRepository
                    .findByEmployee_EmployeeNumberAndDate(secretary.getEmployeeNumber(), date);

            ScheduleEntry entry = existing.orElseGet(ScheduleEntry::new);
            entry.setDate(date);
            entry.setShiftStartTime(request.getShiftStartTime());
            entry.setShiftEndTime(request.getShiftEndTime());
            entry.setEmployee(secretary);

            scheduleEntryRepository.save(entry);
        }
    }
}

