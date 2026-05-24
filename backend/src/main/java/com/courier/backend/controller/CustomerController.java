package com.courier.backend.controller;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.entity.Booking;
import com.courier.backend.service.BookingService;
import com.courier.backend.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private BookingService bookingService;
    @Autowired
    private PricingService pricingService;

//     @PostMapping("/bookings/calculate-cost")
//     public ResponseEntity<ApiResponse<PriceBreakdownDTO>> calculateCost(
//             @RequestBody PriceCalculationDTO dto) {
//         try {
//             PriceBreakdownDTO result = pricingService.calculatePrice(
//                     dto.getParcelWeightGrams(),
//                     dto.getDeliveryType(),
//                     dto.getPackingPreference());
//             return ResponseEntity.ok(
//                     ApiResponse.ok("Price calculated", result));
//         } catch (Exception e) {
//             return ResponseEntity.badRequest()
//                     .body(ApiResponse.error(e.getMessage()));
//         }
//     }
//  @PostMapping("/bookings/calculate-cost")
//     public ResponseEntity<ApiResponse<PriceBreakdownDTO>> calculateCost(
//             @RequestBody PriceCalculationDTO dto) {
//         try {
//             PriceBreakdownDTO result = pricingService.calculatePrice(
//                     dto.getParcelWeightGrams(),
//                     dto.getDeliveryType(),
//                     dto.getPackingPreference(),
//                     dto.getOriginLat(),
//                     dto.getOriginLng(),
//                     dto.getDestLat(),
//                     dto.getDestLng());
//             return ResponseEntity.ok(ApiResponse.ok("Price calculated", result));
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
//         }
//     }
    @PostMapping("/bookings/calculate-cost")
    public ResponseEntity<ApiResponse<PriceBreakdownDTO>> calculateCost(
            @RequestBody PriceCalculationDTO dto) {
        PriceBreakdownDTO price = pricingService.calculatePrice(
                dto.getParcelWeightGrams(),
                dto.getDeliveryType(),
                dto.getPackingPreference(),
                dto.getOriginLat(), // ✅ add karo
                dto.getOriginLng(),
                dto.getDestLat(),
                dto.getDestLng()
        );
        return ResponseEntity.ok(ApiResponse.ok("Price calculated", price));
    }

    @PostMapping("/bookings/create")
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @RequestBody BookingRequestDTO dto,
            @RequestHeader("X-Customer-Id") String customerId) {
        try {
            Booking booking = bookingService
                    .createCustomerBooking(dto, customerId);
            return ResponseEntity.ok(
                    ApiResponse.ok("Booking created", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/payments/checkout")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> processPayment(
            @RequestBody PaymentRequestDTO dto) {
        try {
            PaymentResponseDTO result
                    = bookingService.processPayment(dto);
            return ResponseEntity.ok(
                    ApiResponse.ok("Payment successful", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings/history")
    public ResponseEntity<ApiResponse<Page<BookingHistoryDTO>>> getHistory(
            @RequestHeader("X-Customer-Id") String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<BookingHistoryDTO> result
                    = bookingService.getCustomerBookings(
                            customerId, page, size);
            return ResponseEntity.ok(
                    ApiResponse.ok("Bookings fetched", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

}
