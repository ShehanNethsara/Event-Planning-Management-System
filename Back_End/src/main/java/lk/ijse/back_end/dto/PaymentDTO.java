package lk.ijse.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String transactionId;

    private Long invoiceId;
}