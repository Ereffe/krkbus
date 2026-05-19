package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pk.backend.entity.Reward;
import pk.backend.service.RewardService;
import pk.backend.dto.RewardDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rewards")
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public List<Reward> getAllRewards() {
        return rewardService.getAllRewards();
    }

    @GetMapping("/{rewardId}")
    public Reward getRewardById(@PathVariable Integer rewardId) {
        return rewardService.getRewardById(rewardId);
    }

    @PostMapping
    public Reward createReward(@RequestBody RewardDTO rewardDTO) {
        return rewardService.createReward(rewardDTO);
    }

    @PutMapping("/{rewardId}")
    public Reward updateReward(@PathVariable Integer rewardId, @RequestBody RewardDTO rewardDTO) {
        return rewardService.updateReward(rewardId, rewardDTO);
    }

    @DeleteMapping("/{rewardId}")
    public void deleteReward(@PathVariable Integer rewardId) {
        rewardService.deleteReward(rewardId);
    }
}
