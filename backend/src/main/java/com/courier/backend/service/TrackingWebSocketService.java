package com.courier.backend.service;

import com.courier.backend.dto.DTOs.GpsUpdateDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TrackingWebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void broadcastGpsUpdate(GpsUpdateDTO update) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/tracking/" + update.getBookingId(), update);
        } catch (Exception e) {
            System.err.println("WS broadcast error: " + e.getMessage());
        }
    }
}