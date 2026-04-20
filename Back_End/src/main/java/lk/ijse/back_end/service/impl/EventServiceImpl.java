package lk.ijse.back_end.service.impl;



import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.exception.ResourceNotFoundException;
import lk.ijse.back_end.repository.EventRepository;
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

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public EventDTO saveEvent(EventDTO eventDTO) {
        Event event = modelMapper.map(eventDTO, Event.class);
        event.setStatus("PENDING");
        return modelMapper.map(eventRepository.save(event), EventDTO.class);
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EventDTO updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        event.setStatus(status);
        return modelMapper.map(eventRepository.save(event), EventDTO.class);
    }

    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    @Override
    public List<EventDTO> getEventsByUserId(Long userId) {
        return eventRepository.findByClientId(userId).stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }
}