package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardDTO {
    private String name;
    private Integer pointCost;
    private Integer availableQuantity;
    private Integer clientId;
}
