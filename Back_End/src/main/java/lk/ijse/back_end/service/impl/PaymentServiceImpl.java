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
        // 1. DTO එක Entity එකකට හරවමු
        Payment payment = modelMapper.map(paymentDTO, Payment.class);

        // 2. Invoice එක හොයාගෙන Link කරමු (DTO එකේ එන invoiceId එකෙන්)
        if (paymentDTO.getInvoiceId() != null) {
            Invoice invoice = invoiceRepository.findById(paymentDTO.getInvoiceId())
                    .orElseThrow(() -> new RuntimeException("Invoice not found!"));
            payment.setInvoice(invoice);
        }

        // 3. Transaction ID සහ දිනය සෙට් කරමු
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDate.now());

        // 4. Payment එක සේව් කරමු
        Payment savedPayment = paymentRepository.save(payment);

        // 5. Invoice Status එක 'PAID' ලෙස මාරු කිරීම
        Invoice invoice = savedPayment.getInvoice();
        if (invoice != null) {
            invoice.setStatus("PAID");
            invoiceRepository.save(invoice);
        }

        return modelMapper.map(savedPayment, PaymentDTO.class);
    }

    @Override
    public PaymentDTO getPaymentDetailsByInvoiceId(Long invoiceId) {
        // PaymentRepository එකේ findByInvoiceId Method එක තිබිය යුතුය
        return paymentRepository.findByInvoiceId(invoiceId)
                .map(p -> modelMapper.map(p, PaymentDTO.class))
                .orElse(null);
    }

    @Override
    public PaymentDTO getInvoiceByEventId(Long eventId) {
        // 1. Event ID එක හරහා Invoice එක සොයාගනිමු
        Invoice invoice = invoiceRepository.findByEventId(eventId);

        if (invoice == null) {
            throw new RuntimeException("No invoice found for Event ID: " + eventId);
        }

        // 2. Invoice දත්ත ටික PaymentDTO එකකට දමා යවමු
        PaymentDTO dto = new PaymentDTO();
        dto.setInvoiceId(invoice.getId());
        dto.setAmount(invoice.getAmount());

        // Frontend එකේ පහසුව සඳහා Event title එකත් තිබුණොත් හොඳයි
        if (invoice.getEvent() != null) {
            // මෙතන අමතර දත්ත DTO එකට එකතු කළ හැක
        }

        return dto;
    }
}