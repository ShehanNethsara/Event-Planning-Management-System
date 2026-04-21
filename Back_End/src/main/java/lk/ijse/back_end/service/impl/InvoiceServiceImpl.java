package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.InvoiceDTO;
import lk.ijse.back_end.entity.Invoice;
import lk.ijse.back_end.repository.InvoiceRepository;
import lk.ijse.back_end.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public List<InvoiceDTO> getInvoicesByClientEmail(String email) {
        // Repository එකේ අපි හදපු findByClientEmail එක පාවිච්චි කරනවා
        List<Invoice> invoices = invoiceRepository.findByClientEmail(email);

        return invoices.stream().map(inv -> {
            InvoiceDTO dto = new InvoiceDTO();
            dto.setId(inv.getId());
            dto.setAmount(inv.getAmount());
            dto.setIssuedDate(inv.getIssuedDate());
            dto.setStatus(inv.getStatus());

            // Event එකේ නම DTO එකට දාගමු
            if (inv.getEvent() != null) {
                dto.setEventTitle(inv.getEvent().getTitle());
            }

            return dto;
        }).collect(Collectors.toList());
    }
}