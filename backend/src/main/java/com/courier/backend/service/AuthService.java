package com.courier.backend.service;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.entity.User;
import com.courier.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern MOBILE_PATTERN =
        Pattern.compile("^[6-9]\\d{9}$");
    private static final Pattern PASSWORD_PATTERN =
        Pattern.compile(
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])" +
            "(?=.*[@#$%^&+=!]).{8,}$");

    public RegisterResponseDTO register(UserDTO dto) {
        // Validations
        if (dto.getCustomerName() == null
                || dto.getCustomerName().trim().length() < 2) {
            throw new RuntimeException(
                "Name must be at least 2 characters");
        }
        if (!EMAIL_PATTERN.matcher(dto.getEmail()).matches()) {
            throw new RuntimeException(
                "Invalid email format");
        }
        if (!MOBILE_PATTERN.matcher(dto.getMobileNumber()).matches()) {
            throw new RuntimeException(
                "Invalid mobile number. Must be 10 digits " +
                "starting with 6-9");
        }
        if (!PASSWORD_PATTERN.matcher(dto.getPassword()).matches()) {
            throw new RuntimeException(
                "Password must be 8+ chars with uppercase, " +
                "lowercase, number and special character");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException(
                "Email already registered");
        }
        if (userRepository.existsByMobileNumber(
                dto.getMobileNumber())) {
            throw new RuntimeException(
                "Mobile number already registered");
        }

        long count = userRepository.countByRole(User.Role.CUSTOMER);
        String customerId = String.format("CUST-%04d", count + 1001);
        while (userRepository.existsByCustomerId(customerId)) {
            count++;
            customerId = String.format("CUST-%04d", count + 1001);
        }

        User user = User.builder()
                .customerId(customerId)
                .customerName(dto.getCustomerName().trim())
                .email(dto.getEmail().toLowerCase().trim())
                .mobileNumber(dto.getMobileNumber().trim())
                .address(dto.getAddress())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(User.Role.CUSTOMER)
                .preferences(dto.getPreferences())
                .build();

        userRepository.save(user);

        return RegisterResponseDTO.builder()
                .status("SUCCESS")
                .customerId(customerId)
                .message("Registration successful! " +
                    "Your Customer ID is: " + customerId +
                    ". Please save this ID for future logins.")
                .build();
    }

    // Login with EMAIL or CUSTOMER ID
    public LoginResponseDTO login(LoginDTO dto) {
        User user = null;

        // Try email first
        if (dto.getEmailOrId().contains("@")) {
            user = userRepository
                .findByEmail(dto.getEmailOrId().toLowerCase())
                .orElse(null);
        }

        // Try customer ID
        if (user == null) {
            user = userRepository
                .findByCustomerId(dto.getEmailOrId().toUpperCase())
                .orElse(null);
        }

        if (user == null) {
            throw new RuntimeException(
                "No account found with this email or ID");
        }

        if (!passwordEncoder.matches(
                dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        return LoginResponseDTO.builder()
                .status("SUCCESS")
                .customerId(user.getCustomerId())
                .customerName(user.getCustomerName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful")
                .build();
    }
}