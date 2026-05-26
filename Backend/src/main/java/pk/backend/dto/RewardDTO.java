package pk.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardDTO {
    private Integer id;
    private String name;
    private String description;
    private Integer pointsCost; // Matching frontend naming for easier mapping if possible, or sticking to diagram pointCost
    private Integer availableQuantity;
    // Mocked fields for frontend compatibility
    private String icon;
    private String category;
    private String validUntil;
}

