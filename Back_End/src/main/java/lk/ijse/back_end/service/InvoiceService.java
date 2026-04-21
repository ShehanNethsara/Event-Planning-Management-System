package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.InvoiceDTO;
import java.util.List;

public interface InvoiceService {
    List<InvoiceDTO> getInvoicesByClientEmail(String email);
}