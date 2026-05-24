package com.courier.backend.repository;

import com.courier.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCustomerId(String customerId);
    Optional<User> findByEmail(String email);
    Optional<User> findByMobileNumber(String mobileNumber);

    boolean existsByEmail(String email);
    boolean existsByCustomerId(String customerId);
    boolean existsByMobileNumber(String mobileNumber);
    long countByRole(User.Role role);
}