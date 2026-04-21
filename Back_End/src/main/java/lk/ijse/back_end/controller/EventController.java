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
@CrossOrigin(origins = "*") // Frontend එකේ සිට එන Requests වලට අවසර දීම
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * 1. Client විසින් අලුතින් Event එකක් Book කිරීම
     */
    @PostMapping("/save")
    public ResponseEntity<?> createEvent(@RequestBody EventDTO dto) {
        try {
            if (dto.getClientId() == null) {
                return ResponseEntity.badRequest().body("Error: Client ID is missing!");
            }
            EventDTO savedEvent = eventService.createEvent(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Backend Error: " + e.getMessage());
        }
    }

    /**
     * 2. සියලුම Events ලබා ගැනීම (Admin Panel එක සඳහා)
     */
    @GetMapping("/all")
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    /**
     * 3. තමන්ගේම Events පමණක් ලබා ගැනීම (Client Dashboard එක සඳහා)
     */
    @GetMapping("/my-events")
    public ResponseEntity<List<EventDTO>> getEventsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(eventService.getEventsByClientEmail(email));
    }

    /**
     * 4. පවතින Event එකක Status එක පමණක් වෙනස් කිරීම (Cancel කිරීම වැනි දේට)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            EventDTO updated = eventService.updateEventStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * 5. වැදගත්ම Endpoint එක: Vendor කෙනෙක් Assign කර එකවරම Status එක Approve කිරීම
     * URL: PUT /api/v1/events/{id}/assign-vendor?vendorId=5&status=APPROVED
     */
    @PutMapping("/{id}/assign-vendor")
    public ResponseEntity<?> assignVendorAndApprove(
            @PathVariable Long id,
            @RequestParam Long vendorId,
            @RequestParam String status) {
        try {
            // Service එකේදී Event එකට අදාළ Vendor ව සොයාගෙන set කර status update කළ යුතුය.
            EventDTO updatedEvent = eventService.assignVendorAndStatus(id, vendorId, status);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Assignment Error: " + e.getMessage());
        }
    }

    /**
     * 6. Event එකක් Delete කිරීම
     */
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