package com.courier.backend.controller;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.entity.Booking;
import com.courier.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer")
@CrossOrigin(origins = "*")
public class OfficerController {

    @Autowired private BookingService bookingService;

    @PostMapping("/bookings/counter-create")
    public ResponseEntity<ApiResponse<Booking>> counterCreate(
            @RequestBody OfficerBookingRequestDTO dto) {
        try {
            Booking booking = bookingService.createOfficerBooking(dto);
            return ResponseEntity.ok(
                    ApiResponse.ok("Counter booking created", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings/all")
    public ResponseEntity<ApiResponse<Page<Booking>>> getAllBookings(
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Booking> result = bookingService.getAllBookings(
                    customerId, bookingId, status, page, size);
            return ResponseEntity.ok(
                    ApiResponse.ok("Bookings fetched", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/bookings/{bookingId}/schedule-pickup")
    public ResponseEntity<ApiResponse<Booking>> schedulePickup(
            @PathVariable String bookingId,
            @RequestBody SchedulePickupDTO dto) {
        try {
            Booking result = bookingService
                    .schedulePickup(bookingId, dto);
            return ResponseEntity.ok(
                    ApiResponse.ok("Pickup scheduled", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    //  @PutMapping("/bookings/{bookingId}/cancel")
    // public ResponseEntity<ApiResponse<String>> cancelBooking(
    //         @PathVariable String bookingId) {
    //     try {
    //         String result = bookingService.officerCancelBooking(bookingId);
    //         return ResponseEntity.ok(ApiResponse.ok(result, result));
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    //     }
    // }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable String bookingId,
            @RequestBody StatusUpdateDTO dto) {
        try {
            String result = bookingService
                    .updateDeliveryStatus(bookingId, dto);
                    
            return ResponseEntity.ok(ApiResponse.ok(result, result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/bookings/{bookingId}/gps")
    public ResponseEntity<ApiResponse<String>> updateGps(
            @PathVariable String bookingId,
            @RequestParam Double lat,
            @RequestParam Double lng) {
        try {
            bookingService.updateGpsLocation(bookingId, lat, lng);
            return ResponseEntity.ok(
                    ApiResponse.ok("GPS updated", "Location broadcast sent"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}