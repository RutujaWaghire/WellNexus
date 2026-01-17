package com.wellness.marketplace.config;

import com.wellness.marketplace.model.Product;
import com.wellness.marketplace.model.User;
import com.wellness.marketplace.model.PractitionerProfile;
import com.wellness.marketplace.repository.ProductRepository;
import com.wellness.marketplace.repository.UserRepository;
import com.wellness.marketplace.repository.PractitionerProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            PractitionerProfileRepository practitionerRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Check if data already exists
            if (userRepository.count() > 0) {
                return;
            }
            
            // Create default admin user
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@wellness.com");
            String adminPassword = "Admin@123";
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("admin");
            admin.setBio("System Administrator");
            admin = userRepository.save(admin);
            
            // Create sample users
            User patient = new User();
            patient.setName("John Doe");
            patient.setEmail("patient@example.com");
            patient.setPassword(passwordEncoder.encode("password123"));
            patient.setRole("patient");
            patient.setBio("Looking for wellness solutions");
            userRepository.save(patient);
            
            User practitioner1 = new User();
            practitioner1.setName("Dr. Sarah Smith");
            practitioner1.setEmail("sarah@example.com");
            practitioner1.setPassword(passwordEncoder.encode("password123"));
            practitioner1.setRole("practitioner");
            practitioner1.setBio("Licensed physiotherapist with 10 years experience");
            practitioner1 = userRepository.save(practitioner1);
            
            User practitioner2 = new User();
            practitioner2.setName("Dr. Michael Chen");
            practitioner2.setEmail("michael@example.com");
            practitioner2.setPassword(passwordEncoder.encode("password123"));
            practitioner2.setRole("practitioner");
            practitioner2.setBio("Certified acupuncturist specializing in pain management");
            practitioner2 = userRepository.save(practitioner2);
            
            // Create practitioner profiles
            PractitionerProfile profile1 = new PractitionerProfile();
            profile1.setUserId(practitioner1.getId());
            profile1.setSpecialization("Physiotherapy");
            profile1.setVerified(true);
            profile1.setRating(4.8);
            practitionerRepository.save(profile1);
            
            PractitionerProfile profile2 = new PractitionerProfile();
            profile2.setUserId(practitioner2.getId());
            profile2.setSpecialization("Acupuncture");
            profile2.setVerified(true);
            profile2.setRating(4.9);
            practitionerRepository.save(profile2);
            
            // Create sample products
            Product product1 = new Product();
            product1.setName("Yoga Mat Premium");
            product1.setDescription("High-quality non-slip yoga mat for all types of practice");
            product1.setPrice(49.99);
            product1.setCategory("Equipment");
            product1.setStock(50);
            productRepository.save(product1);
            
            Product product2 = new Product();
            product2.setName("Acupressure Mat");
            product2.setDescription("Therapeutic mat for pain relief and relaxation");
            product2.setPrice(39.99);
            product2.setCategory("Therapy Tools");
            product2.setStock(30);
            productRepository.save(product2);
            
            Product product3 = new Product();
            product3.setName("Essential Oil Set");
            product3.setDescription("Set of 6 premium essential oils for aromatherapy");
            product3.setPrice(59.99);
            product3.setCategory("Aromatherapy");
            product3.setStock(40);
            productRepository.save(product3);
            
            Product product4 = new Product();
            product4.setName("Foam Roller");
            product4.setDescription("Deep tissue massage roller for muscle recovery");
            product4.setPrice(29.99);
            product4.setCategory("Equipment");
            product4.setStock(60);
            productRepository.save(product4);
            
            Product product5 = new Product();
            product5.setName("Herbal Tea Collection");
            product5.setDescription("Ayurvedic herbal tea blend for wellness");
            product5.setPrice(24.99);
            product5.setCategory("Supplements");
            product5.setStock(100);
            productRepository.save(product5);
            
            System.out.println("Sample data initialized successfully!");
            System.out.println("=========================================");
            System.out.println("LOGIN CREDENTIALS:");
            System.out.println("=========================================");
            System.out.println("ADMIN:");
            System.out.println("  Name: Admin User");
            System.out.println("  Email: admin@wellness.com");
            System.out.println("  Password: Admin@123");
            System.out.println("-----------------------------------------");
            System.out.println("Patient - Email: patient@example.com, Password: password123");
            System.out.println("Practitioner 1 - Email: sarah@example.com, Password: password123");
            System.out.println("Practitioner 2 - Email: michael@example.com, Password: password123");
            System.out.println("=========================================");
        };
    }
}
