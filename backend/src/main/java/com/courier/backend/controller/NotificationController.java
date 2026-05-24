package com.courier.backend.controller;

import com.courier.backend.dto.DTOs.ApiResponse;
import com.courier.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
@RestController
@RequestMapping("/api/notify")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/status-change")
    public ResponseEntity<ApiResponse<String>> notifyStatusChange(
            @RequestParam String customerId,
            @RequestParam String bookingId,
            @RequestParam String status) {
        try {
            notificationService.sendStatusNotification(
                    customerId, bookingId, status);
            return ResponseEntity.ok(
                    ApiResponse.ok("Notification sent", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}