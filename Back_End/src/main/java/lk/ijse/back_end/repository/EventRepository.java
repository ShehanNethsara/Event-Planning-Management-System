package lk.ijse.back_end.repository;

import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByClientId(Long clientId);
    List<Event> findByClient(User client);
//    List<Event> findByVendorEmailAndStatus(String email, String status);
    @Query("SELECT e FROM Event e WHERE e.vendor.contact = ?1 AND e.status = ?2")
    List<Event> findByVendorEmailAndStatus(String email, String status);

}