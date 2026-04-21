package lk.ijse.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data // මෙන්න මේක නිසා තමයි setTransactionId වැඩ කරන්නේ
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double paidAmount;
    private LocalDate paymentDate;
    private String paymentMethod;

    // මෙන්න මේ field එක අනිවාර්යයෙන්ම තියෙන්න ඕනේ
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;
}