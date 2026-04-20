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

    @Autowired
    private EventService eventService;

    @PostMapping("/book")
    public ResponseEntity<?> bookEvent(@RequestBody EventDTO eventDTO) {
        return ResponseEntity.ok(eventService.saveEvent(eventDTO));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
}