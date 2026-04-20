package lk.ijse.back_end.service.impl;


import jakarta.transaction.Transactional;
import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.repository.EventRepository;
import lk.ijse.back_end.service.EventService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional

public class EventServiceImpl implements EventService {
    @Autowired
    private EventRepository repository;
    @Autowired
    private ModelMapper mapper;

    @Override
    public EventDTO saveEvent(EventDTO dto) {
        Event event = mapper.map(dto, Event.class);
        event.setStatus("PENDING");
        return mapper.map(repository.save(event), EventDTO.class);
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return repository.findAll().stream()
                .map(e -> mapper.map(e, EventDTO.class)).collect(Collectors.toList());
    }

    @Override
    public EventDTO updateStatus(Long id, String status) {
        Event event = repository.findById(id).orElseThrow(() -> new RuntimeException("Not Found"));
        event.setStatus(status);
        return mapper.map(repository.save(event), EventDTO.class);
    }

    @Override
    public void deleteEvent(Long id) {
        repository.deleteById(id);
    }
}