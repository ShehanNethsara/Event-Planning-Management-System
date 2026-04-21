package lk.ijse.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private Long id;
    private Double amount;
    private LocalDate issuedDate;
    private String status;
    private Long eventId;
    private String eventTitle;
    private String eventDate;
}