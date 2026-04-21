package lk.ijse.back_end.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.back_end.dto.FeedbackDTO;
import lk.ijse.back_end.entity.Feedback;
import lk.ijse.back_end.repository.FeedbackRepository;
import lk.ijse.back_end.service.FeedbackService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    public FeedbackDTO saveFeedback(FeedbackDTO dto) {
        Feedback feedback = modelMapper.map(dto, Feedback.class);
        return modelMapper.map(feedbackRepository.save(feedback), FeedbackDTO.class);
    }

    @Override
    public List<FeedbackDTO> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(f -> modelMapper.map(f, FeedbackDTO.class))
                .collect(Collectors.toList());
    }
}
