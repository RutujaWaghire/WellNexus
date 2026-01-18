package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.Question;
import com.wellness.marketplace.model.Answer;
import com.wellness.marketplace.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/community")
//@CrossOrigin(origins = "*")
public class CommunityController {
    
    @Autowired
    private CommunityService communityService;
    
    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(communityService.createQuestion(question));
    }
    
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(communityService.getAllQuestions());
    }
    
    @PostMapping("/answers")
    public ResponseEntity<Answer> createAnswer(@RequestBody Answer answer) {
        return ResponseEntity.ok(communityService.createAnswer(answer));
    }
    
    @GetMapping("/questions/{questionId}/answers")
    public ResponseEntity<List<Answer>> getQuestionAnswers(@PathVariable Long questionId) {
        return ResponseEntity.ok(communityService.getQuestionAnswers(questionId));
    }
}
