package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.Reward;
import pk.backend.repository.RewardRepository;
import pk.backend.dto.RewardDTO;
import pk.backend.dto.UserPointsDTO;
import pk.backend.dto.PointsHistoryDTO;
import jakarta.persistence.EntityNotFoundException;
import pk.backend.repository.ClientRepository;
import pk.backend.entity.user.Client;
import pk.backend.entity.reservation.Reservation;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<RewardDTO> getAllRewards() {
        return rewardRepository.findAll().stream()
                .map(this::mapToRewardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RewardDTO getRewardById(Integer id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reward with ID " + id + " not found"));
        return mapToRewardDTO(reward);
    }

    @Transactional
    public RewardDTO createReward(RewardDTO rewardDTO) {
        Reward reward = new Reward();
        updateRewardFromDTO(reward, rewardDTO);
        return mapToRewardDTO(rewardRepository.save(reward));
    }

    @Transactional
    public RewardDTO updateReward(Integer id, RewardDTO rewardDTO) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reward with ID " + id + " not found"));
        updateRewardFromDTO(reward, rewardDTO);
        return mapToRewardDTO(rewardRepository.save(reward));
    }

    @Transactional
    public void deleteReward(Integer id) {
        if (!rewardRepository.existsById(id)) {
            throw new EntityNotFoundException("Reward with ID " + id + " not found");
        }
        rewardRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UserPointsDTO getUserPoints(Integer clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        int availablePoints = client.getLoyaltyPoints() != null ? client.getLoyaltyPoints() : 0;
        
        // Calculate redeemed points from history (Client-Reward relationship)
        int redeemedPoints = client.getRewards().stream()
                .mapToInt(Reward::getPointCost)
                .sum();
        
        int totalPoints = availablePoints + redeemedPoints;
        String tier = calculateTier(totalPoints);

        // Generate history from reservations and redeemed rewards (since we cannot change DB)
        List<PointsHistoryDTO> history = new ArrayList<>();
        
        if (client.getReservations() != null) {
            for (Reservation res : client.getReservations()) {
                int earned = (int) (res.getTotalPrice() / 10);
                if (earned > 0) {
                    history.add(new PointsHistoryDTO(
                        "res-" + res.getReservationID(),
                        "earned",
                        earned,
                        "Zakup biletu na trase " + (res.getTrip().getRoute() != null ? res.getTrip().getRoute().getName() : "nieznana"),
                        res.getCreatedAt().toString(),
                        null
                    ));
                }
            }
        }

        if (client.getRewards() != null) {
            for (Reward reward : client.getRewards()) {
                history.add(new PointsHistoryDTO(
                    "rew-" + reward.getRewardID(),
                    "redeemed",
                    reward.getPointCost(),
                    "Wymiana na " + reward.getName(),
                    "2026-05-26", // Placeholder date
                    reward.getRewardID().toString()
                ));
            }
        }

        return new UserPointsDTO(totalPoints, redeemedPoints, availablePoints, tier, history);
    }

    @Transactional
    public UserPointsDTO redeemReward(Integer clientId, Integer rewardId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new EntityNotFoundException("Reward not found"));

        if (reward.getAvailableQuantity() != null && reward.getAvailableQuantity() <= 0) {
            throw new RuntimeException("Reward out of stock");
        }

        int availablePoints = client.getLoyaltyPoints() != null ? client.getLoyaltyPoints() : 0;
        if (availablePoints < reward.getPointCost()) {
            throw new RuntimeException("Not enough points");
        }

        // Deduct points
        client.setLoyaltyPoints(availablePoints - reward.getPointCost());
        
        // Add reward to client
        client.getRewards().add(reward);
        clientRepository.save(client);

        // Update quantity
        if (reward.getAvailableQuantity() != null) {
            reward.setAvailableQuantity(reward.getAvailableQuantity() - 1);
            rewardRepository.save(reward);
        }

        return getUserPoints(clientId);
    }

    private String calculateTier(int points) {
        if (points >= 5000) return "platinum";
        if (points >= 2000) return "gold";
        if (points >= 500) return "silver";
        return "bronze";
    }

    private void updateRewardFromDTO(Reward reward, RewardDTO dto) {
        reward.setName(dto.getName());
        reward.setDescription(dto.getDescription());
        reward.setPointCost(dto.getPointsCost());
        reward.setAvailableQuantity(dto.getAvailableQuantity());
    }

    private RewardDTO mapToRewardDTO(Reward reward) {
        RewardDTO dto = new RewardDTO();
        dto.setId(reward.getRewardID());
        dto.setName(reward.getName());
        dto.setDescription(reward.getDescription());
        dto.setPointsCost(reward.getPointCost());
        dto.setAvailableQuantity(reward.getAvailableQuantity());
        
        // Mocking fields for frontend compatibility
        dto.setIcon("??");
        dto.setCategory("ticket");
        dto.setValidUntil("2026-12-31");
        
        return dto;
    }
}

