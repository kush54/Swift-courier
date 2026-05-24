package com.courier.backend.service;

import com.courier.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private BookingRepository bookingRepository;

    public void sendStatusNotification(
            String customerId,
            String bookingId,
            String status) {

        Map<String, String> payload = new HashMap<>();
        payload.put("bookingId", bookingId);
        payload.put("type", "status");
        payload.put("title", getTitle(status));
        payload.put("body", getBody(bookingId, status));
        payload.put("status", status);

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + customerId, payload);
    }

    private String getTitle(String status) {
        return switch (status.toUpperCase()) {
            case "SCHEDULED" -> "📅 Pickup Scheduled";
            case "PICKEDUP"  -> "📦 Parcel Picked Up";
            case "INTRANSIT" -> "🚚 Parcel In Transit";
            case "DELIVERED" -> "✅ Parcel Delivered!";
            case "CANCELLED" -> "❌ Booking Cancelled";
            default          -> "📬 Booking Updated";
        };
    }

    private String getBody(String bookingId, String status) {
        return switch (status.toUpperCase()) {
            case "SCHEDULED" ->
                "Your parcel " + bookingId
                + " has been scheduled for pickup.";
            case "PICKEDUP" ->
                "Your parcel " + bookingId
                + " has been picked up by our courier.";
            case "INTRANSIT" ->
                "Your parcel " + bookingId
                + " is on its way to the destination!";
            case "DELIVERED" ->
                "Your parcel " + bookingId
                + " has been delivered successfully. 🎉";
            case "CANCELLED" ->
                "Booking " + bookingId
                + " has been cancelled.";
            default ->
                "Your booking " + bookingId
                + " status is now " + status + ".";
        };
    }
}