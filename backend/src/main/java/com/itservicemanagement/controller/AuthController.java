package com.itservicemanagement.controller;

import com.itservicemanagement.dto.*;
import com.itservicemanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itservicemanagement.dto.ResendVerificationRequest;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<AuthResponse> verifyRegistration(
            @Valid @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(
                authService.verifyRegistration(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.forgotPassword(request)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(request)
        );
    }
    @PostMapping("/resend-verification")
        public ResponseEntity<String> resendVerification(
                @Valid @RequestBody ResendVerificationRequest request) {

        return ResponseEntity.ok(
                authService.resendVerification(request.email())
        );
        }
}