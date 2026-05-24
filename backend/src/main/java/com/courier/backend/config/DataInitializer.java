package com.courier.backend.config;

import com.courier.backend.entity.User;
import com.courier.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByCustomerId("OFC-001")) {
            userRepository.save(User.builder()
                .customerId("OFC-001")
                .customerName("Admin Officer")
                .email("officer@swiftcourier.com")
                .mobileNumber("9876543210")
                .address("Swift Courier HQ")
                .password(passwordEncoder.encode("Officer@123"))
                .role(User.Role.OFFICER)
                .build());
            System.out.println(
                "✅ Officer: OFC-001 / Officer@123");
        }

        if (!userRepository.existsByCustomerId("CUST-1001")) {
            userRepository.save(User.builder()
                .customerId("CUST-1001")
                .customerName("Demo Customer")
                .email("demo@swiftcourier.com")
                .mobileNumber("9876543211")
                .address("123 Demo Street, Indore")
                .password(passwordEncoder.encode("Demo@1234"))
                .role(User.Role.CUSTOMER)
                .build());
            System.out.println(
                "✅ Customer: demo@swiftcourier.com / Demo@1234");
        }

        System.out.println(
            "🚀 Backend: http://localhost:8080");
    }
}