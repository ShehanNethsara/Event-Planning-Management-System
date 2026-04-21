package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.PaymentDTO;
import java.util.List;

public interface PaymentService {
    PaymentDTO processPayment(PaymentDTO paymentDTO);
    PaymentDTO getPaymentDetailsByInvoiceId(Long invoiceId);

    PaymentDTO getInvoiceByEventId(Long eventId);
}