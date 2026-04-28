package pk.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class RewardController {

    // TODO: Implement get all rewards
    @GetMapping("/rewards")
    public void getAllRewards() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement get reward by ID
    @GetMapping("/rewards/{rewardId}")
    public void getRewardById(@PathVariable Integer rewardId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement create reward
    @PostMapping("/rewards")
    public void createReward() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement update reward
    @PutMapping("/rewards/{rewardId}")
    public void updateReward(@PathVariable Integer rewardId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // TODO: Implement delete reward
    @DeleteMapping("/rewards/{rewardId}")
    public void deleteReward(@PathVariable Integer rewardId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
