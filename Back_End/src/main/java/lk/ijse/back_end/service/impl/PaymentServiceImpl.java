package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.PaymentDTO;
import lk.ijse.back_end.entity.Invoice;
import lk.ijse.back_end.entity.Payment;
import lk.ijse.back_end.repository.InvoiceRepository;
import lk.ijse.back_end.repository.PaymentRepository;
import lk.ijse.back_end.service.PaymentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
        Payment payment = modelMapper.map(paymentDTO, Payment.class);

        if (paymentDTO.getInvoiceId() != null) {
            Invoice invoice = invoiceRepository.findById(paymentDTO.getInvoiceId())
                    .orElseThrow(() -> new RuntimeException("Invoice not found!"));
            payment.setInvoice(invoice);
        }

        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDate.now());

        Payment savedPayment = paymentRepository.save(payment);

        Invoice invoice = savedPayment.getInvoice();
        if (invoice != null) {
            invoice.setStatus("PAID");
            invoiceRepository.save(invoice);
        }

        return modelMapper.map(savedPayment, PaymentDTO.class);
    }

    @Override
    public PaymentDTO getPaymentDetailsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId)
                .map(p -> modelMapper.map(p, PaymentDTO.class))
                .orElse(null);
    }

    @Override
    public PaymentDTO getInvoiceByEventId(Long eventId) {
        Invoice invoice = invoiceRepository.findByEventId(eventId);

        if (invoice == null) {
            throw new RuntimeException("No invoice found for Event ID: " + eventId);
        }

        PaymentDTO dto = new PaymentDTO();
        dto.setInvoiceId(invoice.getId());
        dto.setAmount(invoice.getAmount());

        if (invoice.getEvent() != null) {
        }

        return dto;
    }
}