package com.courier.backend.controller;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponseDTO>> register(
            @RequestBody UserDTO dto) {
        try {
            RegisterResponseDTO result = authService.register(dto);
            return ResponseEntity.ok(
                    ApiResponse.ok("Registration successful", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @RequestBody LoginDTO dto) {
        try {
            LoginResponseDTO result = authService.login(dto);
            return ResponseEntity.ok(
                    ApiResponse.ok("Login successful", result));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}