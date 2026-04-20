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
@CrossOrigin // Frontend connectivity allow karanna
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * 1. Book a New Event (POST)
     * Client kenek dashboard eken submit karana data save karanne meken.
     */
    @PostMapping("/book")
    public ResponseEntity<?> bookEvent(@RequestBody EventDTO eventDTO) {
        try {
            EventDTO savedEvent = eventService.saveEvent(eventDTO);
            return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Booking failed: " + e.getMessage());
        }
    }

    /**
     * 2. Get All Events (GET)
     * Dashboard table eka refresh karanna data okkoma yawanne meken.
     */
    @GetMapping("/all")
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        try {
            List<EventDTO> allEvents = eventService.getAllEvents();
            return ResponseEntity.ok(allEvents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 3. Update Event Status (PUT)
     * Admin kenek 'Approve' kalama ho Client 'Cancel' kalama status eka update karanne meken.
     * URL Example: /api/v1/events/5/status?status=APPROVED
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            EventDTO updatedEvent = eventService.updateEventStatus(id, status);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed.");
        }
    }

    /**
     * 4. Delete/Cancel Event (DELETE)
     * Event ekak database ekenma ain karanna ona unoth meka use wenawa.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok("Event deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed.");
        }
    }
}