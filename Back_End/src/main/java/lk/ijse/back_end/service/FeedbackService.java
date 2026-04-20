package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.FeedbackDTO;

import java.util.List;

public interface FeedbackService {
    FeedbackDTO saveFeedback(FeedbackDTO dto);
    List<FeedbackDTO> getAllFeedback();
}