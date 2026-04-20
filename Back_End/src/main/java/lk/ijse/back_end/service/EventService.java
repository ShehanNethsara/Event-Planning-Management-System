package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.EventDTO;

import java.util.List;

public interface EventService {
    EventDTO saveEvent(EventDTO dto);
    List<EventDTO> getAllEvents();
    EventDTO updateStatus(Long id, String status);
    void deleteEvent(Long id);
}