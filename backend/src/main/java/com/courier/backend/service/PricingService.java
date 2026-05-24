package com.courier.backend.service;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.entity.Booking;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PricingService {

    private static final BigDecimal BASE_RATE = new BigDecimal("50.00");
    private static final BigDecimal WEIGHT_RATE_PER_100G = new BigDecimal("5.00");
    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");
    private static final BigDecimal ADMIN_FEE = new BigDecimal("25.00");

    public PriceBreakdownDTO calculatePrice(Integer weightGrams,
            String deliveryType, String packingPreference) {

        BigDecimal baseRate = BASE_RATE;

        BigDecimal weightCharge = WEIGHT_RATE_PER_100G
                .multiply(new BigDecimal(Math.ceil(weightGrams / 100.0)))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal deliveryCharge;
        switch (deliveryType.toUpperCase()) {
            case "EXPRESS"   -> deliveryCharge = new BigDecimal("100.00");
            case "OVERNIGHT" -> deliveryCharge = new BigDecimal("200.00");
            default          -> deliveryCharge = new BigDecimal("0.00");
        }

        BigDecimal packingCharge;
        switch (packingPreference.toUpperCase()) {
            case "FRAGILE"    -> packingCharge = new BigDecimal("50.00");
            case "HEAVY_DUTY" -> packingCharge = new BigDecimal("80.00");
            default           -> packingCharge = new BigDecimal("0.00");
        }

        BigDecimal subtotal = baseRate
                .add(weightCharge)
                .add(deliveryCharge)
                .add(packingCharge);

        BigDecimal taxAmount = subtotal
                .multiply(TAX_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalServiceCost = subtotal
                .add(taxAmount)
                .setScale(2, RoundingMode.HALF_UP);

        return PriceBreakdownDTO.builder()
                .baseRate(baseRate)
                .weightCharge(weightCharge)
                .deliveryCharge(deliveryCharge)
                .packingCharge(packingCharge)
                .taxAmount(taxAmount)
                .totalServiceCost(totalServiceCost)
                .build();
    }

    public BigDecimal getAdminFee() {
        return ADMIN_FEE;
    }

    public PriceBreakdownDTO calculateWithAdminFee(Integer weightGrams,
            String deliveryType, String packingPreference) {
        PriceBreakdownDTO base = calculatePrice(weightGrams,
                deliveryType, packingPreference);
        BigDecimal newTotal = base.getTotalServiceCost()
                .add(ADMIN_FEE)
                .setScale(2, RoundingMode.HALF_UP);
        base.setTotalServiceCost(newTotal);
        return base;
    }

    public Booking.DeliveryType parseDeliveryType(String type) {
        try { return Booking.DeliveryType.valueOf(type.toUpperCase()); }
        catch (Exception e) { return Booking.DeliveryType.STANDARD; }
    }

    public Booking.PackingPreference parsePackingPreference(String pref) {
        try { return Booking.PackingPreference.valueOf(pref.toUpperCase()); }
        catch (Exception e) { return Booking.PackingPreference.BASIC; }
    }
}