package com.wellness.marketplace.service;

import com.wellness.marketplace.dto.OrderDTO;
import com.wellness.marketplace.model.Order;
import com.wellness.marketplace.model.Product;
import com.wellness.marketplace.repository.OrderRepository;
import com.wellness.marketplace.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public Order createOrder(Order order) {
        Product product = productRepository.findById(order.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStock() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }
        
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("pending");
        order.setTotalAmount(product.getPrice() * order.getQuantity());
        
        product.setStock(product.getStock() - order.getQuantity());
        productRepository.save(product);
        
        return orderRepository.save(order);
    }
    
    public List<OrderDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setProductId(order.getProductId());
        dto.setQuantity(order.getQuantity());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        
        // Fetch product name
        Product product = productRepository.findById(order.getProductId()).orElse(null);
        if (product != null) {
            dto.setProductName(product.getName());
        }
        
        return dto;
    }
}

