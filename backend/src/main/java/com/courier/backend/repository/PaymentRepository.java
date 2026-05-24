package com.courier.backend.repository;

import com.courier.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(String bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
    long countByStatus(Payment.PaymentStatus status);
}