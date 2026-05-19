package pk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PriceDTO {
    private Float normalTicket;
    private Float studentTicket;
    private Float seniorTicket;
    private Float dayPass;
    private Integer routeId;
}

