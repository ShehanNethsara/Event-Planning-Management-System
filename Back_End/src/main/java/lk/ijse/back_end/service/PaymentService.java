package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.PaymentDTO;

public interface PaymentService {
    PaymentDTO processPayment(PaymentDTO paymentDTO);
    PaymentDTO getInvoiceByEventId(Long eventId);
}