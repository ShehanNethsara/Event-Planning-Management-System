package lk.ijse.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String date;
    private String type; // Wedding, Concert, etc.
    private String status; // PENDING, APPROVED, COMPLETED

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User client; // Event eka book karapu user
}
