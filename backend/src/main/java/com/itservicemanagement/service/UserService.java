package com.itservicemanagement.service;

import com.itservicemanagement.dto.UserResponse;
import com.itservicemanagement.entity.User;
import com.itservicemanagement.enums.Role;
import com.itservicemanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UserResponse> getUsersByRole(
            Role role) {

        return userRepository.findByRole(role)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getUserById(
            Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return toResponse(user);
    }

    public UserResponse updateRole(
            Long id,
            Role role) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        user.setRole(role);

        return toResponse(
                userRepository.save(user)
        );
    }

    private UserResponse toResponse(
            User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}