package com.courier.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bookingId;

    @Column(nullable = false)
    private String customerId;

    private String customerName;

    @Column(nullable = false)
    private String receiverName;

    @Column(nullable = false)
    private String receiverAddress;

    private String receiverPin;

    @Column(nullable = false)
    private String receiverMobile;

    private Integer parcelWeightGrams;
    private String parcelContentsDescription;

    @Enumerated(EnumType.STRING)
    private DeliveryType deliveryType;

    @Enumerated(EnumType.STRING)
    private PackingPreference packingPreference;

    private String pickupTime;
    private String dropoffTime;

    private BigDecimal baseRate;
    private BigDecimal weightCharge;
    private BigDecimal deliveryCharge;
    private BigDecimal packingCharge;
    private BigDecimal taxAmount;
    private BigDecimal adminFee;
    private BigDecimal totalServiceCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private String courierAssetId;
    private String courierName;
    private LocalDateTime scheduledPickupDate;
    private LocalDateTime scheduledDropoffDate;

    private Double currentLat;
    private Double currentLng;
    private Double originLat;
    private Double originLng;
    private Double destLat;
    private Double destLng;

    private String paymentMode;

    private LocalDateTime bookingDate;
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
        if (status == null) status = BookingStatus.NEW;
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    public enum DeliveryType {
        STANDARD, EXPRESS, OVERNIGHT
    }

    public enum PackingPreference {
        BASIC, FRAGILE, HEAVY_DUTY
    }

    public enum BookingStatus {
        NEW, BOOKED, SCHEDULED, PICKEDUP, INTRANSIT, DELIVERED, CANCELLED
    }
}