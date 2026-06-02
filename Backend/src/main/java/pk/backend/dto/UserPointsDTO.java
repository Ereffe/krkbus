package pk.backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPointsDTO {
    private Integer totalPoints;
    private Integer redeemedPoints;
    private Integer availablePoints;
    private String tier;
    private List<PointsHistoryDTO> pointsHistory;
}

