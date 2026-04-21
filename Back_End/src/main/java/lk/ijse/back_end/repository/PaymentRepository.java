package lk.ijse.back_end.repository;

import lk.ijse.back_end.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByInvoiceId(Long invoiceId);

}