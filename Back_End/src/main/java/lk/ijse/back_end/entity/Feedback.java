package lk.ijse.back_end.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int rating; // 1-5
    private String comment;
    @ManyToOne
    private User user;
}