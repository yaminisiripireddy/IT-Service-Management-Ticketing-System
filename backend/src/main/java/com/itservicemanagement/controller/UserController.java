package com.itservicemanagement.controller;

import com.itservicemanagement.dto.UserResponse;
import com.itservicemanagement.enums.Role;
import com.itservicemanagement.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService) {

        this.userService = userService;
    }

    /* =========================================================
       ALL USERS
       ADMIN
       ========================================================= */

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    /* =========================================================
       SINGLE USER
       ADMIN
       ========================================================= */

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    /* =========================================================
       SUPPORT AGENTS
       SUPPORT_AGENT / ADMIN
       ========================================================= */

    @GetMapping("/agents")
    @PreAuthorize(
            "hasAnyRole('SUPPORT_AGENT', 'ADMIN')"
    )
    public ResponseEntity<List<UserResponse>> getAgents() {

        return ResponseEntity.ok(
                userService.getUsersByRole(
                        Role.SUPPORT_AGENT
                )
        );
    }

    /* =========================================================
       CHANGE ROLE
       ADMIN
       ========================================================= */

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long id,
            @RequestParam Role role) {

        return ResponseEntity.ok(
                userService.updateRole(
                        id,
                        role
                )
        );
    }
}