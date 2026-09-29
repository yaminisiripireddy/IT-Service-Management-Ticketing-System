package com.itservicemanagement.repository;

import com.itservicemanagement.entity.User;
import com.itservicemanagement.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobileNumber(String mobileNumber);

    boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);

    List<User> findByRole(Role role);
}