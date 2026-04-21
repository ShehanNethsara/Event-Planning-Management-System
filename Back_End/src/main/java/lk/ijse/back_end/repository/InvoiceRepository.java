//package lk.ijse.back_end.repository;
//
//import lk.ijse.back_end.entity.Invoice;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
//
//    // මේක තමයි පාවිච්චි වෙන්නේ Client ගේ Email එකෙන් Invoice ටික හොයාගන්න
//    @Query("SELECT i FROM Invoice i WHERE i.event.client.email = :email")
//    List<Invoice> findByClientEmail(@Param("email") String email);
//
//    Invoice findByEventId(Long eventId);
//}
package lk.ijse.back_end.repository;

import lk.ijse.back_end.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT i FROM Invoice i WHERE i.event.client.email = :email")
    List<Invoice> findByClientEmail(@Param("email") String email);

    Invoice findByEventId(Long eventId);
}