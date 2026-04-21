package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = "*") // Frontend එකට ලේසියෙන් සම්බන්ධ වීමට
public class EventController {

    @Autowired
    private EventService eventService;

    // Frontend එකේ පාවිච්චි කරන්නේ /save නිසා මම මෙය වෙනස් කළා
    @PostMapping("/save")
    public ResponseEntity<?> create(@RequestBody EventDTO dto) {
        try {
            // clientId එක null ද කියලා check කිරීම
            if (dto.getClientId() == null) {
                return ResponseEntity.badRequest().body("Client ID is missing!");
            }
            EventDTO savedEvent = eventService.createEvent(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
        } catch (Exception e) {
            // මොකක් හරි වැරදුනොත් 500 error එකක් වෙනුවට හේතුව පෙන්වමු
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Backend Error: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventDTO>> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // User Dashboard එකට තමන්ගේම events ටික ගන්න මේක ඕනේ
    @GetMapping("/my-events")
    public ResponseEntity<List<EventDTO>> getByClientEmail(@RequestParam String email) {
        // ඇත්තටම email එකෙන් හොයන එක වඩාත් ආරක්ෂිතයි
        return ResponseEntity.ok(eventService.getEventsByClientEmail(email));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, status));
    }
}