package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long orderId;
    private Long sessionId;
    private Double amount;
    private String upiId;
    private String paymentMethod;
}
