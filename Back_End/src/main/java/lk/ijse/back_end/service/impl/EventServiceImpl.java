package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.entity.Invoice;
import lk.ijse.back_end.entity.User;
import lk.ijse.back_end.repository.EventRepository;
import lk.ijse.back_end.repository.InvoiceRepository; // අලුතින් එකතු කළා
import lk.ijse.back_end.repository.UserRepository;
import lk.ijse.back_end.service.EventService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private InvoiceRepository invoiceRepository; // අලුතින් එකතු කළා
    @Autowired private ModelMapper modelMapper;

    @Override
    public EventDTO createEvent(EventDTO dto) {
        // 1. Event එක save කිරීම
        Event event = modelMapper.map(dto, Event.class);

        if (dto.getClientId() == null) {
            throw new RuntimeException("Client ID is required!");
        }

        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        event.setClient(client);
        event.setStatus("PENDING");
        Event savedEvent = eventRepository.save(event);

        // 2. මෙන්න මෙතනදී තමයි Invoice එකක් Auto-generate වෙන්නේ
        Invoice invoice = new Invoice();
        invoice.setEvent(savedEvent); // අර save වුණ event එකට link කරනවා

        // Event Type එක අනුව ගාණ තීරණය කරමු (දැනට default 150,000.00 දාමු)
        invoice.setAmount(150000.00);
        invoice.setIssuedDate(LocalDate.now());
        invoice.setStatus("UNPAID");

        // Invoice එක database එකේ save කරනවා
        invoiceRepository.save(invoice);

        // 3. Response එක යැවීම
        EventDTO responseDTO = modelMapper.map(savedEvent, EventDTO.class);
        responseDTO.setClientId(client.getId());

        return responseDTO;
    }

    // ... අනිත් methods ඔයාගේ කෝඩ් එකේ තිබුණ විදිහම තියන්න ...
    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(e -> {
                    EventDTO dto = modelMapper.map(e, EventDTO.class);
                    if (e.getClient() != null) dto.setClientId(e.getClient().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getEventsByClient(Long clientId) {
        return eventRepository.findByClientId(clientId).stream()
                .map(e -> {
                    EventDTO dto = modelMapper.map(e, EventDTO.class);
                    dto.setClientId(e.getClient().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getEventsByClientEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        List<Event> events = eventRepository.findByClient(user);
        return events.stream()
                .map(event -> {
                    EventDTO dto = modelMapper.map(event, EventDTO.class);
                    dto.setClientId(user.getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public EventDTO updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(status);
        Event updatedEvent = eventRepository.save(event);
        EventDTO dto = modelMapper.map(updatedEvent, EventDTO.class);
        if (updatedEvent.getClient() != null) dto.setClientId(updatedEvent.getClient().getId());
        return dto;
    }

    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found!");
        }
        eventRepository.deleteById(id);
    }
}