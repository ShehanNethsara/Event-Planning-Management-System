package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.PaymentDTO;
import lk.ijse.back_end.entity.Payment;
import lk.ijse.back_end.repository.PaymentRepository;
import lk.ijse.back_end.service.PaymentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
        Payment payment = modelMapper.map(paymentDTO, Payment.class);
        // Transaction ID ekak auto generate karamu professional nisa
        payment.setTransactionId(UUID.randomUUID().toString());
        return modelMapper.map(paymentRepository.save(payment), PaymentDTO.class);
    }

    @Override
    public PaymentDTO getInvoiceByEventId(Long eventId) {
        // SQL query ekakin ho repository ekakin event ID eka anuwa payment eka ganna logic eka
        return null; // Danata meka placeholder ekak danna
    }
}