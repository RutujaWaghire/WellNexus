package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.Review;
import com.wellness.marketplace.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
//@CrossOrigin(origins = "*")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }
    
    @GetMapping("/practitioner/{practitionerId}")
    public ResponseEntity<List<Review>> getPractitionerReviews(@PathVariable Long practitionerId) {
        return ResponseEntity.ok(reviewService.getPractitionerReviews(practitionerId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }
    
    @GetMapping("/practitioner/{practitionerId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long practitionerId) {
        return ResponseEntity.ok(reviewService.calculateAverageRating(practitionerId));
    }
}
