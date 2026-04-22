package lk.ijse.back_end.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String contact; // මෙන්න මේක අනිවාර්යයෙන්ම තියෙන්න ඕනේ (Email එක විදිහට පාවිච්චි කරන්නේ මේකයි)
    private String description;
    private Double priceRange;
}