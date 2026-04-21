package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.PaymentDTO;
import lk.ijse.back_end.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<?> processPayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            PaymentDTO result = paymentService.processPayment(paymentDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed");
        }
    }

    @GetMapping("/invoice/{eventId}")
    public ResponseEntity<?> getInvoiceData(@PathVariable Long eventId) {
        // Invoice generate karanna awashya event details yawanna
        return ResponseEntity.ok(paymentService.getInvoiceByEventId(eventId));
    }
}