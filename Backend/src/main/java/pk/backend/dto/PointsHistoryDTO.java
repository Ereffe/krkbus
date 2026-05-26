package pk.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PointsHistoryDTO {
    private String id;
    private String type;
    private Integer amount;
    private String description;
    private String date;
    private String relatedRewardId;
}

