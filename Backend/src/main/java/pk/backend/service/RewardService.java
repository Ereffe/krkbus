package pk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.backend.entity.Reward;
import pk.backend.repository.RewardRepository;
import pk.backend.dto.RewardDTO;
import jakarta.persistence.EntityNotFoundException;
import pk.backend.repository.ClientRepository;
import pk.backend.entity.user.Client;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Reward getRewardById(Integer id) {
        return rewardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reward with ID " + id + " not found"));
    }

    @Transactional
    public Reward createReward(RewardDTO rewardDTO) {
        Reward reward = new Reward();
        reward.setName(rewardDTO.getName());
        reward.setPointCost(rewardDTO.getPointCost());
        reward.setAvailableQuantity(rewardDTO.getAvailableQuantity());

        if (rewardDTO.getClientId() != null) {
            Client client = clientRepository.findById(rewardDTO.getClientId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Client with ID " + rewardDTO.getClientId() + " not found"));
            reward.setClient(client);
        }

        return rewardRepository.save(reward);
    }

    @Transactional
    public Reward updateReward(Integer id, RewardDTO rewardDTO) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reward with ID " + id + " not found"));

        reward.setName(rewardDTO.getName());
        reward.setPointCost(rewardDTO.getPointCost());
        reward.setAvailableQuantity(rewardDTO.getAvailableQuantity());

        if (rewardDTO.getClientId() != null) {
            Client client = clientRepository.findById(rewardDTO.getClientId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Client with ID " + rewardDTO.getClientId() + " not found"));
            reward.setClient(client);
        } else {
            reward.setClient(null);
        }

        return rewardRepository.save(reward);
    }

    @Transactional
    public void deleteReward(Integer id) {
        if (!rewardRepository.existsById(id)) {
            throw new EntityNotFoundException("Reward with ID " + id + " not found");
        }
        rewardRepository.deleteById(id);
    }
}
