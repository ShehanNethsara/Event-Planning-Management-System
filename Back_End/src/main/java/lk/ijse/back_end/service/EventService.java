package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.repository.EventRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ModelMapper modelMapper;

    public EventDTO saveEvent(EventDTO eventDTO) {
        Event event = modelMapper.map(eventDTO, Event.class);
        event.setStatus("PENDING"); // Default status
        Event savedEvent = eventRepository.save(event);
        return modelMapper.map(savedEvent, EventDTO.class);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }
}