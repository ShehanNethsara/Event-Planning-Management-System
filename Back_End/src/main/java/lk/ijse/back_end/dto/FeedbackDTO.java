package lk.ijse.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class FeedbackDTO {
    private Long id;
    private int rating;
    private String comment;
    private Long clientId;
}