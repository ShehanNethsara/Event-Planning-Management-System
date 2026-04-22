package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.EventDTO;
import java.util.List;

public interface EventService {
    EventDTO createEvent(EventDTO eventDTO);
    List<EventDTO> getAllEvents();
    List<EventDTO> getEventsByClient(Long clientId);
    EventDTO updateEventStatus(Long id, String status);
    void deleteEvent(Long id);
    List<EventDTO> getEventsByClientEmail(String email);
    EventDTO assignVendorAndStatus(Long id, Long vendorId, String status);
    List<EventDTO> getRequestsByVendorEmail(String email);
}