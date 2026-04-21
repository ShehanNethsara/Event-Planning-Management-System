package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.EventDTO;
import lk.ijse.back_end.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin
public class EventController {

    @Autowired private EventService eventService;

    @PostMapping("/create")
    public ResponseEntity<EventDTO> create(@RequestBody EventDTO dto) {
        return ResponseEntity.ok(eventService.createEvent(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventDTO>> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<List<EventDTO>> getByClient(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventsByClient(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, status));
    }
}