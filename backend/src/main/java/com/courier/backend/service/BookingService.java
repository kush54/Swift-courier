package com.courier.backend.service;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.entity.Booking;
import com.courier.backend.entity.Payment;
import com.courier.backend.entity.User;
import com.courier.backend.repository.BookingRepository;
import com.courier.backend.repository.PaymentRepository;
import com.courier.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PricingService pricingService;
    @Autowired private TrackingWebSocketService wsService;
@Autowired private NotificationService notificationService; // ✅ add karo
    private static final Pattern CARD_PATTERN =
            Pattern.compile("^[0-9]{16}$");

    private String generateBookingId() {
        long count = bookingRepository.count();
        return String.format("BK-%s-%04d",
                LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                count + 1);
    }

    private String generateTransactionId() {
        long count = paymentRepository.count();
        return String.format("TXN-%s%04d",
                LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                count + 1);
    }

    private String generateInvoiceNumber() {
        long count = paymentRepository.count();
        return String.format("INV-%s%04d",
                LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                count + 1);
    }

    @Transactional
    public Booking createCustomerBooking(BookingRequestDTO dto,
            String customerId) {
        PriceBreakdownDTO price = pricingService.calculatePrice(
                dto.getParcelWeightGrams(),
                dto.getDeliveryType(),
                dto.getPackingPreference());

        User user = userRepository
                .findByCustomerId(customerId).orElse(null);

        Booking booking = Booking.builder()
                .bookingId(generateBookingId())
                .customerId(customerId)
                .customerName(user != null ? user.getCustomerName() : "N/A")
                .receiverName(dto.getReceiverName())
                .receiverAddress(dto.getReceiverAddress())
                .receiverPin(dto.getReceiverPin())
                .receiverMobile(dto.getReceiverMobile())
                .parcelWeightGrams(dto.getParcelWeightGrams())
                .parcelContentsDescription(dto.getParcelContentsDescription())
                .deliveryType(pricingService.parseDeliveryType(
                        dto.getDeliveryType()))
                .packingPreference(pricingService.parsePackingPreference(
                        dto.getPackingPreference()))
                .pickupTime(dto.getPickupTime())
                .dropoffTime(dto.getDropoffTime())
                .baseRate(price.getBaseRate())
                .weightCharge(price.getWeightCharge())
                .deliveryCharge(price.getDeliveryCharge())
                .packingCharge(price.getPackingCharge())
                .taxAmount(price.getTaxAmount())
                .totalServiceCost(price.getTotalServiceCost())
                .originLat(dto.getOriginLat())
                .originLng(dto.getOriginLng())
                .destLat(dto.getDestLat())
                .destLng(dto.getDestLng())
                .currentLat(dto.getOriginLat())
                .currentLng(dto.getOriginLng())
                .status(Booking.BookingStatus.NEW)
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking createOfficerBooking(OfficerBookingRequestDTO dto) {

        String customerId = dto.getCustomerId();
    User user = null;

    // ✅ Phone number se customer dhundo
    if (customerId == null || customerId.isBlank()) {
        if (dto.getReceiverMobile() != null) {
            user = userRepository
                .findByMobileNumber(dto.getReceiverMobile())
                .orElse(null);
            if (user != null) {
                customerId = user.getCustomerId(); // ✅ sync karo
            }
        }
    } else {
        user = userRepository.findByCustomerId(customerId).orElse(null);
    }

    if (customerId == null || customerId.isBlank()) {
        customerId = "WALK-IN-" + System.currentTimeMillis();
    }

        PriceBreakdownDTO price = pricingService.calculateWithAdminFee(
                dto.getParcelWeightGrams(),
                dto.getDeliveryType(),
                dto.getPackingPreference());

       

        Booking booking = Booking.builder()
                .bookingId(generateBookingId())
                .customerId(customerId)
                .customerName(user != null
                        ? user.getCustomerName() : "Walk-in Customer")
                .receiverName(dto.getReceiverName())
                .receiverAddress(dto.getReceiverAddress())
                .receiverPin(dto.getReceiverPin())
                .receiverMobile(dto.getReceiverMobile())
                .parcelWeightGrams(dto.getParcelWeightGrams())
                .parcelContentsDescription(dto.getParcelContentsDescription())
                .deliveryType(pricingService.parseDeliveryType(
                        dto.getDeliveryType()))
                .packingPreference(pricingService.parsePackingPreference(
                        dto.getPackingPreference()))
                .pickupTime(dto.getPickupTime())
                .dropoffTime(dto.getDropoffTime())
                .baseRate(price.getBaseRate())
                .weightCharge(price.getWeightCharge())
                .deliveryCharge(price.getDeliveryCharge())
                .packingCharge(price.getPackingCharge())
                .taxAmount(price.getTaxAmount())
                .adminFee(pricingService.getAdminFee())
                .totalServiceCost(price.getTotalServiceCost())
                .originLat(dto.getOriginLat())
                .originLng(dto.getOriginLng())
                .destLat(dto.getDestLat())
                .destLng(dto.getDestLng())
                .currentLat(dto.getOriginLat())
                .currentLng(dto.getOriginLng())
                .paymentMode(dto.getPaymentMode())
                .status(Booking.BookingStatus.BOOKED)
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO dto) {
        String cleanCard = dto.getCardNumber().replaceAll("\\s+", "");
        if (!CARD_PATTERN.matcher(cleanCard).matches()) {
            throw new RuntimeException(
                    "Invalid card number. Must be 16 digits.");
        }

        Booking booking = bookingRepository
                .findByBookingId(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found: " + dto.getBookingId()));

        if (booking.getStatus() != Booking.BookingStatus.NEW) {
            throw new RuntimeException(
                    "Booking is not in NEW status. Current: "
                    + booking.getStatus());
        }

        String transactionId = generateTransactionId();
        String invoiceNumber = generateInvoiceNumber();

        Payment payment = Payment.builder()
                .transactionId(transactionId)
                .invoiceNumber(invoiceNumber)
                .bookingId(dto.getBookingId())
                .customerId(booking.getCustomerId())
                .cardholderName(dto.getCardholderName())
                .maskedCardNumber("XXXX-XXXX-XXXX-"
                        + cleanCard.substring(12))
                .expiryDate(dto.getExpiryDate())
                .amount(dto.getAmount())
                .status(Payment.PaymentStatus.SUCCESS)
                .paymentMode("ONLINE")
                .build();

        paymentRepository.save(payment);
        booking.setStatus(Booking.BookingStatus.BOOKED);
        bookingRepository.save(booking);

        return PaymentResponseDTO.builder()
                .status("SUCCESS")
                .transactionId(transactionId)
                .invoiceNumber(invoiceNumber)
                .bookingId(dto.getBookingId())
                .amount(dto.getAmount())
                .message("Payment successful! Invoice: " + invoiceNumber)
                .build();
    }

    public Page<BookingHistoryDTO> getCustomerBookings(
            String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings = bookingRepository
                .findByCustomerIdOrderByIdDesc(customerId, pageable);
        return bookings.map(this::toHistoryDTO);
    }

    @Transactional
    public String cancelBooking(String bookingId, String customerId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!booking.getCustomerId().equals(customerId)) {
            throw new RuntimeException(
                    "Unauthorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.INTRANSIT ||
            booking.getStatus() == Booking.BookingStatus.DELIVERED) {
            throw new RuntimeException(
                    "Cannot cancel. Parcel is " + booking.getStatus());
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return "Booking " + bookingId + " cancelled successfully.";
    }

    public Page<Booking> getAllBookings(String customerId,
            String bookingId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findWithFilters(
                (customerId != null && !customerId.isEmpty())
                        ? customerId : null,
                (bookingId != null && !bookingId.isEmpty())
                        ? bookingId : null,
                (status != null && !status.isEmpty())
                        ? status : null,
                pageable);
    }

//     @Transactional
//     public Booking schedulePickup(String bookingId,
//             SchedulePickupDTO dto) {
//         Booking booking = bookingRepository.findByBookingId(bookingId)
//                 .orElseThrow(() ->
//                         new RuntimeException("Booking not found"));

//         booking.setCourierAssetId(dto.getCourierAssetId());
//         booking.setCourierName(dto.getCourierName());
//         booking.setScheduledPickupDate(dto.getScheduledPickupDate());
//         booking.setScheduledDropoffDate(dto.getScheduledDropoffDate());
//         booking.setStatus(Booking.BookingStatus.SCHEDULED);
//          notificationService.sendStatusNotification(
//         booking.getCustomerId(), bookingId, "SCHEDULED");

//         return bookingRepository.save(booking);
//     }
@Transactional
public Booking schedulePickup(String bookingId, SchedulePickupDTO dto) {
    Booking booking = bookingRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    booking.setCourierAssetId(dto.getCourierAssetId());
    booking.setCourierName(dto.getCourierName());
    booking.setScheduledPickupDate(dto.getScheduledPickupDate());
    booking.setScheduledDropoffDate(dto.getScheduledDropoffDate());
    booking.setStatus(Booking.BookingStatus.SCHEDULED);
    Booking saved = bookingRepository.save(booking);

    // ✅ add karo
    notificationService.sendStatusNotification(
        booking.getCustomerId(), bookingId, "SCHEDULED");

    return saved;
}

    @Transactional
    public String updateDeliveryStatus(String bookingId,
            StatusUpdateDTO dto) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        try {
            Booking.BookingStatus newStatus =
                    Booking.BookingStatus.valueOf(
                            dto.getStatus().toUpperCase());
            booking.setStatus(newStatus);

            if (dto.getCurrentLat() != null)
                booking.setCurrentLat(dto.getCurrentLat());
            if (dto.getCurrentLng() != null)
                booking.setCurrentLng(dto.getCurrentLng());

            bookingRepository.save(booking);
notificationService.sendStatusNotification(
    booking.getCustomerId(), bookingId, dto.getStatus());
            if (dto.getCurrentLat() != null
                    && dto.getCurrentLng() != null) {
                wsService.broadcastGpsUpdate(
                    GpsUpdateDTO.builder()
                        .bookingId(bookingId)
                        .lat(dto.getCurrentLat())
                        .lng(dto.getCurrentLng())
                        .build());
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Invalid status: " + dto.getStatus());
        }

        return "Status updated to " + dto.getStatus()
                + " for booking " + bookingId;
    }

    @Transactional
    public void updateGpsLocation(String bookingId,
            Double lat, Double lng) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
        booking.setCurrentLat(lat);
        booking.setCurrentLng(lng);
        bookingRepository.save(booking);

        wsService.broadcastGpsUpdate(GpsUpdateDTO.builder()
                .bookingId(bookingId).lat(lat).lng(lng).build());
    }

   public TrackingResponseDTO trackBooking(String bookingId,
        boolean isOfficer) {
    Booking booking = bookingRepository.findByBookingId(bookingId)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Booking not found: " + bookingId));

    TrackingResponseDTO.TrackingResponseDTOBuilder builder =
            TrackingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                .bookingDate(booking.getBookingDate() != null
                        ? booking.getBookingDate().toString() : "")
                .status(booking.getStatus().name())
                .currentLat(booking.getCurrentLat())
                .currentLng(booking.getCurrentLng())
                .originLat(booking.getOriginLat())
                .originLng(booking.getOriginLng())
                .destLat(booking.getDestLat())
                .destLng(booking.getDestLng())
                // Always include cost for payment page
                .totalServiceCost(booking.getTotalServiceCost());

    if (isOfficer) {
        builder.receiverName(booking.getReceiverName())
                .receiverAddress(booking.getReceiverAddress())
                .customerName(booking.getCustomerName())
                .courierName(booking.getCourierName())
                .courierAssetId(booking.getCourierAssetId())
                .scheduledPickupDate(
                    booking.getScheduledPickupDate() != null
                        ? booking.getScheduledPickupDate()
                            .toString() : null)
                .scheduledDropoffDate(
                    booking.getScheduledDropoffDate() != null
                        ? booking.getScheduledDropoffDate()
                            .toString() : null);
    }

    return builder.build();
}

    private BookingHistoryDTO toHistoryDTO(Booking b) {
        Payment payment = paymentRepository
                .findByBookingId(b.getBookingId()).orElse(null);
        return BookingHistoryDTO.builder()
                .customerId(b.getCustomerId())
                .bookingId(b.getBookingId())
                .bookingDate(b.getBookingDate() != null
                        ? b.getBookingDate().toString() : "")
                .receiverName(b.getReceiverName())
                .deliveredAddress(b.getReceiverAddress())
                .amountPaid(payment != null
                        ? payment.getAmount() : b.getTotalServiceCost())
                .status(b.getStatus().name())
                .deliveryType(b.getDeliveryType() != null
                        ? b.getDeliveryType().name() : "STANDARD")
                .build();
    }
}

