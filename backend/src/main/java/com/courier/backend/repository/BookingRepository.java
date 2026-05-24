package com.courier.backend.repository;

import com.courier.backend.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingId(String bookingId);

    Page<Booking> findByCustomerIdOrderByIdDesc(String customerId, Pageable pageable);

    Page<Booking> findAllByOrderByIdDesc(Pageable pageable);

    long countByStatus(Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:customerId IS NULL OR b.customerId = :customerId) AND " +
           "(:bookingId IS NULL OR b.bookingId = :bookingId) AND " +
           "(:status IS NULL OR CAST(b.status AS string) = :status) " +
           "ORDER BY b.id DESC")
    Page<Booking> findWithFilters(
            @Param("customerId") String customerId,
            @Param("bookingId") String bookingId,
            @Param("status") String status,
            Pageable pageable);
}