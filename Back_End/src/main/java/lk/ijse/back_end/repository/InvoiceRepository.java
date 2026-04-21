package lk.ijse.back_end.repository;

import lk.ijse.back_end.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // මේ Query එක හරියටම Email එක අරන් ඒකට අදාළ Invoices ටික දෙනවා
    @Query("SELECT i FROM Invoice i WHERE i.event.client.email = :email")
    List<Invoice> findByClientEmail(@Param("email") String email);
}