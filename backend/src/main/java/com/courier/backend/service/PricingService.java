// package com.courier.backend.service;

// import com.courier.backend.dto.DTOs.*;
// import com.courier.backend.entity.Booking;
// import org.springframework.stereotype.Service;
// import java.math.BigDecimal;
// import java.math.RoundingMode;

// @Service
// public class PricingService {

//     private static final BigDecimal BASE_RATE = new BigDecimal("50.00");
//     private static final BigDecimal WEIGHT_RATE_PER_100G = new BigDecimal("5.00");
//     private static final BigDecimal TAX_RATE = new BigDecimal("0.18");
//     private static final BigDecimal ADMIN_FEE = new BigDecimal("25.00");

//     public PriceBreakdownDTO calculatePrice(Integer weightGrams,
//             String deliveryType, String packingPreference) {

//         BigDecimal baseRate = BASE_RATE;

//         BigDecimal weightCharge = WEIGHT_RATE_PER_100G
//                 .multiply(new BigDecimal(Math.ceil(weightGrams / 100.0)))
//                 .setScale(2, RoundingMode.HALF_UP);

//         BigDecimal deliveryCharge;
//         switch (deliveryType.toUpperCase()) {
//             case "EXPRESS"   -> deliveryCharge = new BigDecimal("100.00");
//             case "OVERNIGHT" -> deliveryCharge = new BigDecimal("200.00");
//             default          -> deliveryCharge = new BigDecimal("0.00");
//         }

//         BigDecimal packingCharge;
//         switch (packingPreference.toUpperCase()) {
//             case "FRAGILE"    -> packingCharge = new BigDecimal("50.00");
//             case "HEAVY_DUTY" -> packingCharge = new BigDecimal("80.00");
//             default           -> packingCharge = new BigDecimal("0.00");
//         }

//         BigDecimal subtotal = baseRate
//                 .add(weightCharge)
//                 .add(deliveryCharge)
//                 .add(packingCharge);

//         BigDecimal taxAmount = subtotal
//                 .multiply(TAX_RATE)
//                 .setScale(2, RoundingMode.HALF_UP);

//         BigDecimal totalServiceCost = subtotal
//                 .add(taxAmount)
//                 .setScale(2, RoundingMode.HALF_UP);

//         return PriceBreakdownDTO.builder()
//                 .baseRate(baseRate)
//                 .weightCharge(weightCharge)
//                 .deliveryCharge(deliveryCharge)
//                 .packingCharge(packingCharge)
//                 .taxAmount(taxAmount)
//                 .totalServiceCost(totalServiceCost)
//                 .build();
//     }

//     public BigDecimal getAdminFee() {
//         return ADMIN_FEE;
//     }

//     public PriceBreakdownDTO calculateWithAdminFee(Integer weightGrams,
//             String deliveryType, String packingPreference) {
//         PriceBreakdownDTO base = calculatePrice(weightGrams,
//                 deliveryType, packingPreference);
//         BigDecimal newTotal = base.getTotalServiceCost()
//                 .add(ADMIN_FEE)
//                 .setScale(2, RoundingMode.HALF_UP);
//         base.setTotalServiceCost(newTotal);
//         return base;
//     }

//     public Booking.DeliveryType parseDeliveryType(String type) {
//         try { return Booking.DeliveryType.valueOf(type.toUpperCase()); }
//         catch (Exception e) { return Booking.DeliveryType.STANDARD; }
//     }

//     public Booking.PackingPreference parsePackingPreference(String pref) {
//         try { return Booking.PackingPreference.valueOf(pref.toUpperCase()); }
//         catch (Exception e) { return Booking.PackingPreference.BASIC; }
//     }
// }



// // package com.courier.backend.service;

// // import com.courier.backend.dto.DTOs.*;
// // import com.courier.backend.entity.Booking;
// // import org.springframework.stereotype.Service;
// // import java.math.BigDecimal;
// // import java.math.RoundingMode;

// // @Service
// // public class PricingService {

// //     private static final BigDecimal BASE_RATE = new BigDecimal("50.00");
// //     private static final BigDecimal WEIGHT_RATE_PER_100G = new BigDecimal("5.00");
// //     private static final BigDecimal TAX_RATE = new BigDecimal("0.18");
// //     private static final BigDecimal ADMIN_FEE = new BigDecimal("25.00");
// //     // Distance pricing: ₹2 per km
// //     private static final BigDecimal RATE_PER_KM = new BigDecimal("2.00");

// //     public PriceBreakdownDTO calculatePrice(Integer weightGrams,
// //             String deliveryType, String packingPreference) {
// //         return calculatePrice(weightGrams, deliveryType, packingPreference, 0.0, 0.0, 0.0, 0.0);
// //     }

// //     public PriceBreakdownDTO calculatePrice(
// //             Integer weightGrams, String deliveryType,
// //             String packingPreference,
// //             Double originLat, Double originLng,
// //             Double destLat, Double destLng) {

// //         BigDecimal baseRate = BASE_RATE;

// //         // Weight charge
// //         BigDecimal weightCharge = WEIGHT_RATE_PER_100G
// //                 .multiply(new BigDecimal(Math.ceil(weightGrams / 100.0)))
// //                 .setScale(2, RoundingMode.HALF_UP);

// //         // Delivery type charge
// //         BigDecimal deliveryCharge = switch (deliveryType.toUpperCase()) {
// //             case "EXPRESS"   -> new BigDecimal("100.00");
// //             case "OVERNIGHT" -> new BigDecimal("200.00");
// //             default          -> BigDecimal.ZERO;
// //         };

// //         // Packing charge
// //         BigDecimal packingCharge = switch (packingPreference.toUpperCase()) {
// //             case "FRAGILE"    -> new BigDecimal("50.00");
// //             case "HEAVY_DUTY" -> new BigDecimal("80.00");
// //             default           -> BigDecimal.ZERO;
// //         };

// //         // Distance charge
// //         BigDecimal distanceCharge = BigDecimal.ZERO;
// //         double distanceKm = 0.0;
// //         if (originLat != null && originLng != null
// //                 && destLat != null && destLng != null
// //                 && (originLat != 0 || originLng != 0)
// //                 && (destLat != 0 || destLng != 0)) {
// //             distanceKm = haversine(originLat, originLng, destLat, destLng);
// //             distanceCharge = RATE_PER_KM
// //                     .multiply(new BigDecimal(distanceKm))
// //                     .setScale(2, RoundingMode.HALF_UP);
// //         }

// //         BigDecimal subtotal = baseRate
// //                 .add(weightCharge)
// //                 .add(deliveryCharge)
// //                 .add(packingCharge)
// //                 .add(distanceCharge);

// //         BigDecimal taxAmount = subtotal
// //                 .multiply(TAX_RATE)
// //                 .setScale(2, RoundingMode.HALF_UP);

// //         BigDecimal totalServiceCost = subtotal
// //                 .add(taxAmount)
// //                 .setScale(2, RoundingMode.HALF_UP);

// //         return PriceBreakdownDTO.builder()
// //                 .baseRate(baseRate)
// //                 .weightCharge(weightCharge)
// //                 .deliveryCharge(deliveryCharge)
// //                 .packingCharge(packingCharge)
// //                 .distanceCharge(distanceCharge)
// //                 .distanceKm(new BigDecimal(distanceKm).setScale(2, RoundingMode.HALF_UP))
// //                 .taxAmount(taxAmount)
// //                 .totalServiceCost(totalServiceCost)
// //                 .build();
// //     }

// //     public PriceBreakdownDTO calculateWithAdminFee(
// //             Integer weightGrams, String deliveryType, String packingPreference,
// //             Double originLat, Double originLng, Double destLat, Double destLng) {
// //         PriceBreakdownDTO base = calculatePrice(
// //                 weightGrams, deliveryType, packingPreference,
// //                 originLat, originLng, destLat, destLng);
// //         BigDecimal newTotal = base.getTotalServiceCost()
// //                 .add(ADMIN_FEE)
// //                 .setScale(2, RoundingMode.HALF_UP);
// //         base.setTotalServiceCost(newTotal);
// //         return base;
// //     }

// //     public BigDecimal getAdminFee() { return ADMIN_FEE; }

// //     private double haversine(double lat1, double lng1,
// //             double lat2, double lng2) {
// //         final int R = 6371;
// //         double dLat = Math.toRadians(lat2 - lat1);
// //         double dLon = Math.toRadians(lng2 - lng1);
// //         double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
// //                 + Math.cos(Math.toRadians(lat1))
// //                 * Math.cos(Math.toRadians(lat2))
// //                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //         return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //     }

// //     public Booking.DeliveryType parseDeliveryType(String type) {
// //         try { return Booking.DeliveryType.valueOf(type.toUpperCase()); }
// //         catch (Exception e) { return Booking.DeliveryType.STANDARD; }
// //     }

// //     public Booking.PackingPreference parsePackingPreference(String pref) {
// //         try { return Booking.PackingPreference.valueOf(pref.toUpperCase()); }
// //         catch (Exception e) { return Booking.PackingPreference.BASIC; }
// //     }
// // }



package com.courier.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.courier.backend.dto.DTOs.*;
import com.courier.backend.dto.DTOs.PriceBreakdownDTO;
import com.courier.backend.entity.Booking;

@Service
public class PricingService {

    private static final BigDecimal BASE_RATE = new BigDecimal("50.00");
    private static final BigDecimal WEIGHT_RATE_PER_100G = new BigDecimal("5.00");
    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");
    private static final BigDecimal ADMIN_FEE = new BigDecimal("25.00");
    private static final BigDecimal RATE_PER_KM = new BigDecimal("2.00");

    // ✅ Without distance — backward compatible
    public PriceBreakdownDTO calculatePrice(Integer weightGrams,
            String deliveryType, String packingPreference) {
        return calculatePrice(weightGrams, deliveryType, packingPreference,
            0.0, 0.0, 0.0, 0.0);
    }

    // ✅ With distance
    public PriceBreakdownDTO calculatePrice(
            Integer weightGrams, String deliveryType,
            String packingPreference,
            Double originLat, Double originLng,
            Double destLat, Double destLng) {

        BigDecimal baseRate = BASE_RATE;

        BigDecimal weightCharge = WEIGHT_RATE_PER_100G
                .multiply(new BigDecimal(Math.ceil(weightGrams / 100.0)))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal deliveryCharge = switch (deliveryType.toUpperCase()) {
            case "EXPRESS"   -> new BigDecimal("100.00");
            case "OVERNIGHT" -> new BigDecimal("200.00");
            default          -> BigDecimal.ZERO;
        };

        BigDecimal packingCharge = switch (packingPreference.toUpperCase()) {
            case "FRAGILE"    -> new BigDecimal("50.00");
            case "HEAVY_DUTY" -> new BigDecimal("80.00");
            default           -> BigDecimal.ZERO;
        };

        BigDecimal distanceCharge = BigDecimal.ZERO;
        double distanceKm = 0.0;
        if (originLat != null && originLng != null
                && destLat != null && destLng != null
                && (originLat != 0 || originLng != 0)
                && (destLat != 0 || destLng != 0)) {
            distanceKm = haversine(originLat, originLng, destLat, destLng);
            distanceCharge = RATE_PER_KM
                    .multiply(new BigDecimal(distanceKm))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal subtotal = baseRate
                .add(weightCharge)
                .add(deliveryCharge)
                .add(packingCharge)
                .add(distanceCharge);

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

    // ✅ Without distance
    public PriceBreakdownDTO calculateWithAdminFee(Integer weightGrams,
            String deliveryType, String packingPreference) {
        return calculateWithAdminFee(weightGrams, deliveryType,
            packingPreference, 0.0, 0.0, 0.0, 0.0);
    }

    // ✅ With distance
    public PriceBreakdownDTO calculateWithAdminFee(
            Integer weightGrams, String deliveryType, String packingPreference,
            Double originLat, Double originLng, Double destLat, Double destLng) {
        PriceBreakdownDTO base = calculatePrice(
                weightGrams, deliveryType, packingPreference,
                originLat, originLng, destLat, destLng);
        BigDecimal newTotal = base.getTotalServiceCost()
                .add(ADMIN_FEE)
                .setScale(2, RoundingMode.HALF_UP);
        base.setTotalServiceCost(newTotal);
        return base;
    }

    public BigDecimal getAdminFee() { return ADMIN_FEE; }

    private double haversine(double lat1, double lng1,
            double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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