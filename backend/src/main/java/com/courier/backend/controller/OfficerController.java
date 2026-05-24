package com.courier.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.dto.DTOs.ApiResponse;
import com.courier.backend.dto.DTOs.OfficerBookingRequestDTO;
import com.courier.backend.dto.DTOs.SchedulePickupDTO;
import com.courier.backend.dto.DTOs.StatusUpdateDTO;
import com.courier.backend.entity.Booking;
import com.courier.backend.service.BookingService;
import com.courier.backend.service.NotificationService;

@RestController
@RequestMapping("/api/officer")
@CrossOrigin(origins = "*")
public class OfficerController {
@Autowired
private NotificationService notificationService;
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

@PutMapping("/bookings/{bookingId}/cancel")
public ResponseEntity<ApiResponse<String>> cancelBooking(
        @PathVariable String bookingId) {

    try {

        Booking booking = bookingService
                .findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Prevent invalid cancellation
        if (booking.getStatus() == Booking.BookingStatus.DELIVERED ||
            booking.getStatus() == Booking.BookingStatus.INTRANSIT) {

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(
                            "Cannot cancel — parcel is "
                                    + booking.getStatus()));
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        bookingService.save(booking);

        // Send notification
      notificationService.sendStatusNotification(
    booking.getCustomerId(),
    bookingId,
    "CANCELLED"
);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Booking cancelled successfully",
                        bookingId
                )
        );

    } catch (Exception e) {

        return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
    }
}

}