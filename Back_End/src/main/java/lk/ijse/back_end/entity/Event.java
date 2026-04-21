package lk.ijse.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private String type; // Wedding, Corporate, Concert etc.

    private LocalDate date;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private String status; // PENDING, APPROVED, CANCELLED

    // Event එක අයිති client ව මෙතනින් link කරනවා
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User client;

    private String location; // මේක තියෙනවාද බලන්න

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;
}