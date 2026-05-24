package com.courier.backend.service;

import com.courier.backend.entity.Booking;
import com.courier.backend.entity.Payment;
import com.courier.backend.repository.BookingRepository;
import com.courier.backend.repository.PaymentRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private PaymentRepository paymentRepository;

    private static final DeviceRgb PRIMARY =
            new DeviceRgb(0, 82, 204);
    private static final DeviceRgb LIGHT_GRAY =
            new DeviceRgb(245, 245, 245);

    public byte[] generateInvoice(String bookingId) throws Exception {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found: " + bookingId));
        Payment payment = paymentRepository
                .findByBookingId(bookingId).orElse(null);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        DateTimeFormatter dtf =
                DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

        document.add(new Paragraph("SWIFT COURIER")
                .setFontSize(28).setBold()
                .setFontColor(PRIMARY)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("INVOICE / RECEIPT")
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.DARK_GRAY));

        document.add(new Paragraph(" "));

        Table infoTable = new Table(
                UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();

        if (payment != null) {
            infoTable.addCell(label("Invoice Number:"));
            infoTable.addCell(value(payment.getInvoiceNumber()));
            infoTable.addCell(label("Transaction ID:"));
            infoTable.addCell(value(payment.getTransactionId()));
            infoTable.addCell(label("Payment Date:"));
            infoTable.addCell(value(payment.getPaymentDate() != null
                    ? payment.getPaymentDate().format(dtf) : "N/A"));
            infoTable.addCell(label("Payment Mode:"));
            infoTable.addCell(value(payment.getPaymentMode() != null
                    ? payment.getPaymentMode() : "ONLINE"));
        }
        infoTable.addCell(label("Booking ID:"));
        infoTable.addCell(value(booking.getBookingId()));
        infoTable.addCell(label("Booking Date:"));
        infoTable.addCell(value(booking.getBookingDate() != null
                ? booking.getBookingDate().format(dtf) : "N/A"));
        infoTable.addCell(label("Status:"));
        infoTable.addCell(value(booking.getStatus().name()));
        document.add(infoTable);
        document.add(new Paragraph(" "));

        document.add(new Paragraph("DELIVERY DETAILS")
                .setFontSize(12).setBold().setFontColor(PRIMARY));

        Table detailsTable = new Table(
                UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();
        detailsTable.addCell(label("Customer ID:"));
        detailsTable.addCell(value(booking.getCustomerId()));
        detailsTable.addCell(label("Receiver Name:"));
        detailsTable.addCell(value(booking.getReceiverName()));
        detailsTable.addCell(label("Delivery Address:"));
        detailsTable.addCell(value(booking.getReceiverAddress()));
        detailsTable.addCell(label("Receiver Mobile:"));
        detailsTable.addCell(value(booking.getReceiverMobile()));
        detailsTable.addCell(label("Delivery Type:"));
        detailsTable.addCell(value(booking.getDeliveryType() != null
                ? booking.getDeliveryType().name() : "STANDARD"));
        detailsTable.addCell(label("Weight:"));
        detailsTable.addCell(value(booking.getParcelWeightGrams()
                + " grams"));
        document.add(detailsTable);
        document.add(new Paragraph(" "));

        document.add(new Paragraph("COST BREAKDOWN")
                .setFontSize(12).setBold().setFontColor(PRIMARY));

        Table costTable = new Table(
                UnitValue.createPercentArray(new float[]{3, 1}))
                .useAllAvailableWidth();
        addCostRow(costTable, "Base Rate",
                "Rs." + booking.getBaseRate());
        addCostRow(costTable, "Weight Charge",
                "Rs." + booking.getWeightCharge());
        addCostRow(costTable, "Delivery Charge",
                "Rs." + booking.getDeliveryCharge());
        addCostRow(costTable, "Packing Charge",
                "Rs." + booking.getPackingCharge());
        addCostRow(costTable, "Tax (18% GST)",
                "Rs." + booking.getTaxAmount());
        if (booking.getAdminFee() != null) {
            addCostRow(costTable, "Admin Fee",
                    "Rs." + booking.getAdminFee());
        }

        costTable.addCell(new Cell()
                .add(new Paragraph("TOTAL AMOUNT")
                        .setBold().setFontSize(12))
                .setBackgroundColor(PRIMARY)
                .setFontColor(ColorConstants.WHITE).setPadding(8));
        costTable.addCell(new Cell()
                .add(new Paragraph("Rs."
                        + booking.getTotalServiceCost())
                        .setBold().setFontSize(12))
                .setBackgroundColor(PRIMARY)
                .setFontColor(ColorConstants.WHITE).setPadding(8)
                .setTextAlignment(TextAlignment.RIGHT));
        document.add(costTable);
        document.add(new Paragraph(" "));

        document.add(new Paragraph(
                "Thank you for choosing Swift Courier!")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY)
                .setFontSize(10));

        document.close();
        return baos.toByteArray();
    }

    private Cell label(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold())
                .setBackgroundColor(LIGHT_GRAY).setPadding(5);
    }

    private Cell value(String text) {
        return new Cell()
                .add(new Paragraph(text != null ? text : "N/A"))
                .setPadding(5);
    }

    private void addCostRow(Table table,
            String lbl, String val) {
        table.addCell(new Cell()
                .add(new Paragraph(lbl)).setPadding(5));
        table.addCell(new Cell()
                .add(new Paragraph(val)).setPadding(5)
                .setTextAlignment(TextAlignment.RIGHT));
    }
}