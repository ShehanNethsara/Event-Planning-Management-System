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
        // Repository එකේ @Query එක හරහා Email එකට අදාළ Invoices ටික ගන්නවා
//        List<Invoice> invoices = invoiceRepository.findByClientEmail(email);
        List<Invoice> invoices = invoiceRepository.findByClientEmail(email);
        System.out.println("DEBUG: Found " + invoices.size() + " invoices for email: " + email);

        return invoices.stream().map(inv -> {
            InvoiceDTO dto = new InvoiceDTO();
            dto.setId(inv.getId());
            dto.setAmount(inv.getAmount());
            dto.setIssuedDate(inv.getIssuedDate());
            dto.setStatus(inv.getStatus());

            if (inv.getEvent() != null) {
                dto.setEventId(inv.getEvent().getId());
                dto.setEventTitle(inv.getEvent().getTitle());

                // Event එකේ Date එක String එකක් විදිහට Frontend එකට පහසුවෙන් යවමු
                if (inv.getEvent().getDate() != null) {
                    dto.setEventDate(inv.getEvent().getDate().toString());
                }
            }

            return dto;
        }).collect(Collectors.toList());
    }
}