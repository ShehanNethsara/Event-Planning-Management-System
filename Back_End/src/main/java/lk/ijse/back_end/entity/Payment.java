package lk.ijse.back_end.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double amount;
    private String paymentMethod; // Card, Cash, etc.
    private String transactionId;
    @OneToOne
    private Event event;
}