package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String status;
    private String message;
    private String transactionId;
    private Double amount;
    private Long orderId;
    private Long sessionId;
}
