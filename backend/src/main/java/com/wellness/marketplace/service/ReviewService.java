package com.wellness.marketplace.service;

import com.wellness.marketplace.model.Review;
import com.wellness.marketplace.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }
    
    public List<Review> getPractitionerReviews(Long practitionerId) {
        return reviewRepository.findByPractitionerId(practitionerId);
    }
    
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    public Double calculateAverageRating(Long practitionerId) {
        List<Review> reviews = reviewRepository.findByPractitionerId(practitionerId);
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
