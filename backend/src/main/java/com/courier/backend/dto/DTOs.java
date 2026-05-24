package com.courier.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DTOs {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserDTO {
        private String customerName;
        private String email;
        private String mobileNumber;
        private String address;
        private String password;
        private String preferences;
    }

   @Data @NoArgsConstructor @AllArgsConstructor @Builder
public static class LoginDTO {
    private String emailOrId; // email OR customerId
    private String password;
}

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LoginResponseDTO {
        private String status;
        private String customerId;
        private String customerName;
        private String email;
        private String role;
        private String message;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RegisterResponseDTO {
        private String status;
        private String customerId;
        private String message;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PriceCalculationDTO {
        private Integer parcelWeightGrams;
        private String deliveryType;
        private String packingPreference;
    }


    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PriceBreakdownDTO {
        private java.math.BigDecimal baseRate;
        private java.math.BigDecimal weightCharge;
        private java.math.BigDecimal deliveryCharge;
        private java.math.BigDecimal packingCharge;
        // private java.math.BigDecimal distanceCharge;   // NEW
        // private java.math.BigDecimal distanceKm;        // NEW
        private java.math.BigDecimal taxAmount;
        private java.math.BigDecimal totalServiceCost;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BookingRequestDTO {
        private String receiverName;
        private String receiverAddress;
        private String receiverPin;
        private String receiverMobile;
        private Integer parcelWeightGrams;
        private String parcelContentsDescription;
        private String deliveryType;
        private String packingPreference;
        private String pickupTime;
        private String dropoffTime;
        private Double originLat;
        private Double originLng;
        private Double destLat;
        private Double destLng;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OfficerBookingRequestDTO {
        private String customerId;
        private String receiverName;
        private String receiverAddress;
        private String receiverPin;
        private String receiverMobile;
        private Integer parcelWeightGrams;
        private String parcelContentsDescription;
        private String deliveryType;
        private String packingPreference;
        private String pickupTime;
        private String dropoffTime;
        private String paymentMode;
        private Double originLat;
        private Double originLng;
        private Double destLat;
        private Double destLng;
    }


  

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaymentRequestDTO {
        private String bookingId;
        private String cardholderName;
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private BigDecimal amount;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaymentResponseDTO {
        private String status;
        private String transactionId;
        private String invoiceNumber;
        private String bookingId;
        private BigDecimal amount;
        private String message;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SchedulePickupDTO {
        private String courierAssetId;
        private String courierName;
        private LocalDateTime scheduledPickupDate;
        private LocalDateTime scheduledDropoffDate;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StatusUpdateDTO {
        private String status;
        private Double currentLat;
        private Double currentLng;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class GpsUpdateDTO {
        private String bookingId;
        private Double lat;
        private Double lng;
    }

  @Data @NoArgsConstructor @AllArgsConstructor @Builder
public static class TrackingResponseDTO {
    private String bookingId;
    private String bookingDate;
    private String status;
    private String receiverName;
    private String receiverAddress;
    private String customerName;
    private String courierName;
    private String courierAssetId;
    private java.math.BigDecimal totalServiceCost;
    private Double currentLat;
    private Double currentLng;
    private Double originLat;
    private Double originLng;
    private Double destLat;
    private Double destLng;
    private String scheduledPickupDate;
    private String scheduledDropoffDate;
}

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BookingHistoryDTO {
        private String customerId;
        private String bookingId;
        private String bookingDate;
        private String receiverName;
        private String deliveredAddress;
        private BigDecimal amountPaid;
        private String status;
        private String deliveryType;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> ok(String message, T data) {
            return new ApiResponse<>(true, message, data);
        }

        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(false, message, null);
        }
    }
}