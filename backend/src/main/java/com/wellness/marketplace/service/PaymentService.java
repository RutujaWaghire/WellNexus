package com.wellness.marketplace.service;

import com.wellness.marketplace.dto.PaymentRequest;
import com.wellness.marketplace.dto.PaymentResponse;
import com.wellness.marketplace.model.Order;
import com.wellness.marketplace.model.TherapySession;
import com.wellness.marketplace.repository.OrderRepository;
import com.wellness.marketplace.repository.TherapySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private TherapySessionRepository sessionRepository;
    
    public PaymentResponse processPayment(PaymentRequest request) {
        PaymentResponse response = new PaymentResponse();
        
        try {
            // Generate dummy transaction ID
            String transactionId = "TXN_" + UUID.randomUUID().toString();
            
            // Process Order Payment
            if (request.getOrderId() != null) {
                Order order = orderRepository.findById(request.getOrderId())
                        .orElseThrow(() -> new RuntimeException("Order not found"));
                
                // Dummy payment processing - always succeeds
                order.setStatus("completed");
                orderRepository.save(order);
                
                response.setStatus("SUCCESS");
                response.setMessage("Payment successful for order");
                response.setTransactionId(transactionId);
                response.setAmount(request.getAmount());
                response.setOrderId(request.getOrderId());
            }
            
            // Process Session Payment
            if (request.getSessionId() != null) {
                TherapySession session = sessionRepository.findById(request.getSessionId())
                        .orElseThrow(() -> new RuntimeException("Session not found"));
                
                // Dummy payment processing - always succeeds
                session.setStatus("confirmed");
                sessionRepository.save(session);
                
                response.setStatus("SUCCESS");
                response.setMessage("Payment successful for session");
                response.setTransactionId(transactionId);
                response.setAmount(request.getAmount());
                response.setSessionId(request.getSessionId());
            }
            
        } catch (Exception e) {
            response.setStatus("FAILED");
            response.setMessage("Payment processing failed: " + e.getMessage());
        }
        
        return response;
    }
}
