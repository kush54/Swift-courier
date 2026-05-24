package com.courier.backend.controller;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.entity.Booking;
import com.courier.backend.repository.BookingRepository;
import com.courier.backend.service.BookingService;
import com.courier.backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shared")
@CrossOrigin(origins = "*")
public class SharedController {

    @Autowired private BookingService bookingService;
    @Autowired private InvoiceService invoiceService;
    @Autowired private BookingRepository bookingRepository;

    @GetMapping("/track/{bookingId}")
    public ResponseEntity<ApiResponse<TrackingResponseDTO>> track(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-Role",
                    required = false) String role) {
        try {
            boolean isOfficer = "OFFICER".equalsIgnoreCase(role);
            TrackingResponseDTO result =
                    bookingService.trackBooking(bookingId, isOfficer);
            // Always include totalServiceCost for payment page
            if (result.getTotalServiceCost() == null) {
                bookingRepository.findByBookingId(bookingId)
                    .ifPresent(b -> result
                        .setTotalServiceCost(b.getTotalServiceCost()));
            }
            return ResponseEntity.ok(
                    ApiResponse.ok("Tracking info fetched", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/invoice/{bookingId}/download")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable String bookingId) {
        try {
            byte[] pdfBytes =
                    invoiceService.generateInvoice(bookingId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment",
                    "invoice-" + bookingId + ".pdf");
            headers.setContentLength(pdfBytes.length);
            return ResponseEntity.ok()
                    .headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}