package lk.ijse.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Double amount;
    private String paymentMethod;
    private String transactionId;
    private Long eventId; // Event ekata link karanna
}