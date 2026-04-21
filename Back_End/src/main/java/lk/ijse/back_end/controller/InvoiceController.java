package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.InvoiceDTO;
import lk.ijse.back_end.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/my-invoices")
    public ResponseEntity<List<InvoiceDTO>> getMyInvoices(@RequestParam String email) {
        // Logic එක Service එකට බාර දෙනවා
        List<InvoiceDTO> invoiceDTOs = invoiceService.getInvoicesByClientEmail(email);
        return ResponseEntity.ok(invoiceDTOs);
    }
}