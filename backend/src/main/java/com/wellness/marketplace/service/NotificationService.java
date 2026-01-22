package com.wellness.marketplace.service;

import com.wellness.marketplace.model.Notification;
import com.wellness.marketplace.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired(required = false)
    private AnalyticsService analyticsService;
    
    /**
     * Create and send a notification
     */
    public Notification createNotification(Long userId, String type, String message) {
        try {
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setType(type);
            notification.setMessage(message);
            notification.setStatus("unread");
            notification.setCreatedAt(LocalDateTime.now());
            
            Notification savedNotification = notificationRepository.save(notification);
            
            // Log notification creation
            if (analyticsService != null) {
                analyticsService.logAction(userId, "NOTIFICATION_SENT", "NOTIFICATIONS",
                    "Type: " + type + ", Message: " + message, null, "Notification",
                    savedNotification.getId(), "SUCCESS", null);
            }
            
            logger.info("Notification created for user {} with type {}", userId, type);
            return savedNotification;
        } catch (Exception e) {
            logger.error("Error creating notification", e);
            
            if (analyticsService != null) {
                try {
                    analyticsService.logAction(userId, "NOTIFICATION_CREATION_FAILED", "NOTIFICATIONS",
                        "Type: " + type, null, null, null, "FAILURE", e.getMessage());
                } catch (Exception ex) {
                    logger.warn("Failed to log notification failure analytics", ex);
                }
            }
            
            throw new RuntimeException("Failed to create notification", e);
        }
    }
    
    /**
     * Send notification (alias for createNotification)
     */
    public Notification sendNotification(Long userId, String title, String message) {
        return createNotification(userId, title, message);
    }
    
    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndStatus(userId, "unread");
    }
    
    /**
     * Mark notification as read
     */
    public Notification markAsRead(Long id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));
            notification.setStatus("read");
            
            Notification savedNotification = notificationRepository.save(notification);
            
            // Log notification read action
            if (analyticsService != null) {
                analyticsService.logAction(notification.getUserId(), "NOTIFICATION_READ", "NOTIFICATIONS",
                    "Notification ID: " + id, null, "Notification", id, "SUCCESS", null);
            }
            
            logger.info("Notification {} marked as read", id);
            return savedNotification;
        } catch (Exception e) {
            logger.error("Error marking notification as read", e);
            throw new RuntimeException("Failed to mark notification as read", e);
        }
    }
    
    /**
     * Delete a notification
     */
    public void deleteNotification(Long id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));
            
            notificationRepository.delete(notification);
            
            // Log notification deletion
            if (analyticsService != null) {
                analyticsService.logAction(notification.getUserId(), "NOTIFICATION_DELETED", "NOTIFICATIONS",
                    "Notification ID: " + id, null, "Notification", id, "SUCCESS", null);
            }
            
            logger.info("Notification {} deleted", id);
        } catch (Exception e) {
            logger.error("Error deleting notification", e);
            throw new RuntimeException("Failed to delete notification", e);
        }
    }
    
    /**
     * Get notification statistics
     */
    public long getUnreadCount(Long userId) {
        return getUnreadNotifications(userId).size();
    }
}
