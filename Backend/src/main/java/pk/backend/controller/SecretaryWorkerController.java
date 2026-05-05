package pk.backend.controller;

import org.springframework.web.bind.annotation.*;

/**
 * Controller for Owner/Manager use cases
 * Handles owner operations using REST API CRUD operations
 */
@RestController
@RequestMapping("/api/owner")
public class SecretaryWorkerController {

    // ==================== Secretary Worker Management ====================

    // TODO: Implement get all secretary workers
    @GetMapping("/workers/secretary")
    public void getAllSecretaryWorkers() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get secretary worker by ID
    @GetMapping("/workers/secretary/{workerId}")
    public void getSecretaryWorkerById(@PathVariable Integer workerId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create secretary worker
    @PostMapping("/workers/secretary")
    public void createSecretaryWorker() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update secretary worker
    @PutMapping("/workers/secretary/{workerId}")
    public void updateSecretaryWorker(@PathVariable Integer workerId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete secretary worker
    @DeleteMapping("/workers/secretary/{workerId}")
    public void deleteSecretaryWorker(@PathVariable Integer workerId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update secretary worker schedule
    @PutMapping("/workers/secretary/{workerId}/schedule")
    public void updateSecretaryWorkerSchedule(@PathVariable Integer workerId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

}


