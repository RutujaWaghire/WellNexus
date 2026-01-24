package com.wellness.marketplace.service;

import com.wellness.marketplace.model.Order;
import com.wellness.marketplace.model.Product;
import com.wellness.marketplace.repository.OrderRepository;
import com.wellness.marketplace.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

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
        
        // Reduce stock immediately on order creation
        product.setStock(product.getStock() - order.getQuantity());
        productRepository.save(product);
        
        return orderRepository.save(order);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
