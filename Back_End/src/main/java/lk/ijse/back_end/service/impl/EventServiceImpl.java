package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.entity.User;
import lk.ijse.back_end.repository.EventRepository;
import lk.ijse.back_end.repository.UserRepository;
import lk.ijse.back_end.service.EventService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    public EventDTO createEvent(EventDTO dto) {
        Event event = modelMapper.map(dto, Event.class);

        // Client ID eka haraha real User object eka hoyagena link karanawa
        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        event.setClient(client);
        event.setStatus("PENDING"); // Default status

        return modelMapper.map(eventRepository.save(event), EventDTO.class);
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(e -> modelMapper.map(e, EventDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getEventsByClient(Long clientId) {
        return eventRepository.findByClientId(clientId).stream()
                .map(e -> modelMapper.map(e, EventDTO.class)).collect(Collectors.toList());
    }

    @Override
    public EventDTO updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(status);
        return modelMapper.map(eventRepository.save(event), EventDTO.class);
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}