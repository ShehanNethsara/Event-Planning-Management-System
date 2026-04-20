package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.FeedbackDTO;
import lk.ijse.back_end.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/add")
    public ResponseEntity<FeedbackDTO> addFeedback(@RequestBody FeedbackDTO dto) {
        return ResponseEntity.ok(feedbackService.saveFeedback(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}