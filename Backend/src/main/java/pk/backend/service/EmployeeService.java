package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.user.Employee;
import pk.backend.repository.EmployeeRepository;
import pk.backend.dto.EmployeeDTO;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployeesByPosition(String position) {
        return employeeRepository.findAll().stream()
                .filter(e -> position.equalsIgnoreCase(e.getPosition()) || 
                            (e.getRole() != null && e.getRole().equalsIgnoreCase(position)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeByIdAndPosition(Integer id, String position) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee with ID " + id + " not found"));
        if (!position.equalsIgnoreCase(employee.getPosition()) && 
            !(employee.getRole() != null && employee.getRole().equalsIgnoreCase(position))) {
            throw new IllegalArgumentException("Employee is not a " + position);
        }
        return employee;
    }

    @Transactional
    public Employee createEmployee(EmployeeDTO employeeDTO, String position) {
        Employee employee = new Employee();
        employee.setPosition(position);
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Integer id, EmployeeDTO employeeDTO, String position) {
        Employee employee = getEmployeeByIdAndPosition(id, position);
        // Employee currently only has position, so updating a driver to a driver
        // doesn't change anything,
        // but we keep the signature for future fields (like name, surname from a User
        // relation if added).
        return employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Integer id, String position) {
        Employee employee = getEmployeeByIdAndPosition(id, position);
        employeeRepository.delete(employee);
    }
}
