package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private String status;
}
