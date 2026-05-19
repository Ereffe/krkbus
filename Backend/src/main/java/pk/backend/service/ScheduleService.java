package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.user.ScheduleEntry;
import pk.backend.repository.ScheduleEntryRepository;
import pk.backend.repository.EmployeeRepository;
import pk.backend.repository.TripRepository;
import pk.backend.dto.ScheduleEntryDTO;
import pk.backend.entity.user.Employee;
import pk.backend.entity.trip.Trip;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleEntryRepository scheduleEntryRepository;
    private final EmployeeRepository employeeRepository;
    private final TripRepository tripRepository;

    @Transactional(readOnly = true)
    public List<ScheduleEntry> getAllSchedules() {
        return scheduleEntryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ScheduleEntry getScheduleById(Integer id) {
        return scheduleEntryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ScheduleEntry with ID " + id + " not found"));
    }

    @Transactional
    public ScheduleEntry createSchedule(ScheduleEntryDTO dto) {
        ScheduleEntry entry = new ScheduleEntry();
        entry.setDate(dto.getDate());
        entry.setShiftStartTime(dto.getShiftStartTime());
        entry.setShiftEndTime(dto.getShiftEndTime());
        
        if (dto.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(dto.getEmployeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
            entry.setEmployee(employee);
        }
        
        if (dto.getTripId() != null) {
            Trip trip = tripRepository.findById(dto.getTripId())
                    .orElseThrow(() -> new EntityNotFoundException("Trip not found"));
            entry.setTrip(trip);
        }
        
        return scheduleEntryRepository.save(entry);
    }

    @Transactional
    public ScheduleEntry updateSchedule(Integer id, ScheduleEntryDTO dto) {
        ScheduleEntry entry = scheduleEntryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ScheduleEntry with ID " + id + " not found"));
        
        entry.setDate(dto.getDate());
        entry.setShiftStartTime(dto.getShiftStartTime());
        entry.setShiftEndTime(dto.getShiftEndTime());
        
        if (dto.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(dto.getEmployeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
            entry.setEmployee(employee);
        } else {
            entry.setEmployee(null);
        }
        
        if (dto.getTripId() != null) {
            Trip trip = tripRepository.findById(dto.getTripId())
                    .orElseThrow(() -> new EntityNotFoundException("Trip not found"));
            entry.setTrip(trip);
        } else {
            entry.setTrip(null);
        }
        
        return scheduleEntryRepository.save(entry);
    }

    @Transactional
    public void deleteSchedule(Integer id) {
        if (!scheduleEntryRepository.existsById(id)) {
            throw new EntityNotFoundException("ScheduleEntry with ID " + id + " not found");
        }
        scheduleEntryRepository.deleteById(id);
    }
}
