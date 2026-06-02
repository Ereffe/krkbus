package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.RewardDTO;
import pk.backend.dto.UserPointsDTO;
import pk.backend.service.RewardService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rewards")
@CrossOrigin(origins = "*")
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<RewardDTO>> getAllRewards() {
        return ResponseEntity.ok(rewardService.getAllRewards());
    }

    @GetMapping("/{rewardId}")
    public ResponseEntity<RewardDTO> getRewardById(@PathVariable Integer rewardId) {
        return ResponseEntity.ok(rewardService.getRewardById(rewardId));
    }

    @PostMapping
    public ResponseEntity<RewardDTO> createReward(@RequestBody RewardDTO rewardDTO) {
        return ResponseEntity.ok(rewardService.createReward(rewardDTO));
    }

    @PutMapping("/{rewardId}")
    public ResponseEntity<RewardDTO> updateReward(@PathVariable Integer rewardId, @RequestBody RewardDTO rewardDTO) {
        return ResponseEntity.ok(rewardService.updateReward(rewardId, rewardDTO));
    }

    @DeleteMapping("/{rewardId}")
    public ResponseEntity<Void> deleteReward(@PathVariable Integer rewardId) {
        rewardService.deleteReward(rewardId);
        return ResponseEntity.ok().build();
    }

    // ==================== User Points & History ====================

    @GetMapping("/user/{clientId}/points")
    public ResponseEntity<UserPointsDTO> getUserPoints(@PathVariable Integer clientId) {
        return ResponseEntity.ok(rewardService.getUserPoints(clientId));
    }

    @PostMapping("/user/{clientId}/redeem/{rewardId}")
    public ResponseEntity<UserPointsDTO> redeemReward(@PathVariable Integer clientId, @PathVariable Integer rewardId) {
        return ResponseEntity.ok(rewardService.redeemReward(clientId, rewardId));
    }
}

