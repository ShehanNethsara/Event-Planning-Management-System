package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.entity.User;
import lk.ijse.back_end.repository.UserRepository;
import lk.ijse.back_end.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = "*") // Frontend එකේ සිට එන Requests වලට අවසර දීම
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/save")
    public ResponseEntity<?> createEvent(@RequestBody java.util.Map<String, Object> payload) {
        try {
            EventDTO dto = new EventDTO();
            dto.setTitle((String) payload.get("title"));
            dto.setType((String) payload.get("type"));
            dto.setLocation((String) payload.get("location"));
            dto.setDescription((String) payload.getOrDefault("notes", ""));
            dto.setStatus("PENDING");

            String dateStr = (String) payload.get("date");
            if (dateStr != null && !dateStr.isEmpty()) {
                dto.setDate(java.time.LocalDate.parse(dateStr));
            }

            String email = (String) payload.get("clientEmail");
            if (email != null && !email.isEmpty()) {
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));
                dto.setClientId(user.getId());
            }

            if (dto.getClientId() == null) {
                return ResponseEntity.badRequest().body("Error: Client not identified. Please login again.");
            }

            EventDTO saved = eventService.createEvent(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }


    @GetMapping("/my-events")
    public ResponseEntity<List<EventDTO>> getEventsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(eventService.getEventsByClientEmail(email));
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            EventDTO updated = eventService.updateEventStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/assign-vendor")
    public ResponseEntity<?> assignVendorAndApprove(
            @PathVariable Long id,
            @RequestParam Long vendorId,
            @RequestParam(required = false, defaultValue = "APPROVED") String status) {
        try {
            EventDTO updatedEvent = eventService.assignVendorAndStatus(id, vendorId, status);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Assignment Error: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok().body("Event deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/vendor-requests")
    public ResponseEntity<List<EventDTO>> getRequestsForVendor(@RequestParam String email) {
        // Status එක 'REQUESTED' සහ Vendor Email එක ගැලපෙන ඒවා පමණක් එවන්න
        return ResponseEntity.ok(eventService.getRequestsByVendorEmail(email));
    }
}