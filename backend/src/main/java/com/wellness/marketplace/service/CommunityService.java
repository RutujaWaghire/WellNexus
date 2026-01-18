package com.wellness.marketplace.service;

import com.wellness.marketplace.model.Question;
import com.wellness.marketplace.model.Answer;
import com.wellness.marketplace.repository.QuestionRepository;
import com.wellness.marketplace.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommunityService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    public Question createQuestion(Question question) {
        question.setCreatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }
    
    public List<Question> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Answer createAnswer(Answer answer) {
        answer.setCreatedAt(LocalDateTime.now());
        return answerRepository.save(answer);
    }
    
    public List<Answer> getQuestionAnswers(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }
}
