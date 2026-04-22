package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.Event;
import lk.ijse.back_end.entity.Invoice;
import lk.ijse.back_end.entity.User;
import lk.ijse.back_end.entity.Vendor;
import lk.ijse.back_end.repository.EventRepository;
import lk.ijse.back_end.repository.InvoiceRepository;
import lk.ijse.back_end.repository.UserRepository;
import lk.ijse.back_end.repository.VendorRepository;
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

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired

    private ModelMapper modelMapper;
    @Autowired
    private VendorRepository vendorRepository;

    @Override
    public EventDTO createEvent(EventDTO dto) {
        // 1. Client ව පරීක්ෂා කිරීම (Hardcoded ID 22 වැළැක්වීමට මෙය ඉතා වැදගත්)
        if (dto.getClientId() == null) {
            throw new RuntimeException("Client ID is missing in the request!");
        }

        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getClientId()));

        System.out.println("DEBUG: Creating event for User: " + client.getEmail() + " (ID: " + client.getId() + ")");

        // 2. Event එක සේව් කිරීම (Manual Mapping - වඩාත් ආරක්ෂිතයි)
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setType(dto.getType());
        event.setDate(dto.getDate());
        event.setLocation(dto.getLocation());
        event.setDescription(dto.getDescription());
        event.setStatus("PENDING");
        event.setClient(client); // මෙතනට වැටෙන්නේ Frontend එකෙන් එවපු ID එකට අදාළ User වයි.

        Event savedEvent = eventRepository.save(event);

        // 3. Invoice එකක් Auto-generate කිරීම
        try {
            Invoice invoice = new Invoice();
            invoice.setEvent(savedEvent);
            invoice.setAmount(150000.00);
            invoice.setIssuedDate(LocalDate.now());
            invoice.setStatus("UNPAID");

            invoiceRepository.save(invoice);
            System.out.println("DEBUG: Invoice successfully linked to Event ID: " + savedEvent.getId());
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR: Failed to generate invoice: " + e.getMessage());
        }

        // 4. Response එක සකස් කිරීම
        EventDTO responseDTO = modelMapper.map(savedEvent, EventDTO.class);
        responseDTO.setClientId(client.getId());
        return responseDTO;
    }

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
                    if (e.getClient() != null) dto.setClientId(e.getClient().getId());
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

    // EventServiceImpl.java ඇතුළත @Override එකක් ලෙස මෙය ලියන්න

    @Override
    public EventDTO assignVendorAndStatus(Long id, Long vendorId, String status) {
        // 1. අදාළ Event එක හොයාගන්නවා
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));

        // 3. Event එකට Vendor ව සහ Status එක 'APPROVED' ලෙස set කරනවා
        event.setVendor(vendor);
        event.setStatus(status);

        // 4. Save කරලා ආපහු DTO එකක් විදිහට පද්ධතියට දෙනවා
        Event savedEvent = eventRepository.save(event);
        return modelMapper.map(savedEvent, EventDTO.class);
    }
    // EventServiceImpl.java ඇතුළත
    @Override
    public List<EventDTO> getRequestsByVendorEmail(String email) {
        // Repository එකෙන් email එක සහ status එක REQUESTED වන ඒව හොයන්න
        List<Event> events = eventRepository.findByVendorEmailAndStatus(email, "REQUESTED");
        return events.stream()
                .map(e -> modelMapper.map(e, EventDTO.class))
                .collect(Collectors.toList());
    }
}