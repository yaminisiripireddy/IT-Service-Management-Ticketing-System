package com.itservicemanagement.service;

import org.springframework.beans.factory.annotation.Value;

import com.itservicemanagement.dto.*;
import com.itservicemanagement.entity.User;
import com.itservicemanagement.enums.Role;
import com.itservicemanagement.repository.UserRepository;
import com.itservicemanagement.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.admin.registration-code}")
    private String adminRegistrationCode;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    // ============================================================
    // REGISTER
    // ============================================================

    public String register(RegisterRequest request) {

        // Check password confirmation.
        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException(
                    "Passwords do not match"
            );
        }

        // Check whether email already exists.
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        // Check whether mobile number already exists.
        if (userRepository.existsByMobileNumber(request.mobileNumber())) {
            throw new IllegalArgumentException(
                    "Mobile number already registered"
            );
        }

        // Check selected role.
        Role requestedRole = request.role();

        if (requestedRole == null) {
            throw new IllegalArgumentException(
                    "Please select a role"
            );
        }

        // ========================================================
        // ADMIN REGISTRATION VALIDATION
        // ========================================================

        if (requestedRole == Role.ADMIN) {

            if (request.adminCode() == null ||
                    !request.adminCode().equals(adminRegistrationCode)) {

                throw new IllegalArgumentException(
                        "Invalid Admin registration code"
                );
            }

            // Only one ADMIN is allowed.
            if (!userRepository.findByRole(Role.ADMIN).isEmpty()) {

                throw new IllegalArgumentException(
                        "An Admin account already exists"
                );
            }
        }

        // Generate a six-digit OTP.
        String otp = generateOtp();

        // Create the user object.
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .mobileNumber(request.mobileNumber())
                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )
                .role(requestedRole)
                .verified(false)
                .verificationOtp(otp)
                .otpExpiry(
                        LocalDateTime.now().plusMinutes(5)
                )
                .build();

        /*
         * IMPORTANT:
         *
         * We DO NOT save the user here.
         *
         * First send the OTP.
         * The user will only be saved after successful OTP verification.
         *
         * This prevents an unverified account from being inserted into
         * PostgreSQL when email sending fails.
         */

        emailService.sendOtpEmail(
                user.getEmail(),
                otp,
                "Account Registration"
        );

        /*
         * Store the user only after the email was successfully sent.
         *
         * If emailService.sendOtpEmail() throws an exception,
         * this line will never execute.
         */
        userRepository.save(user);

        return "Registration successful. OTP sent for verification.";
    }


    // ============================================================
    // RESEND VERIFICATION OTP
    // ============================================================

    public String resendVerification(String email) {

        User user = findUser(email);

        if (user.isVerified()) {
            throw new IllegalArgumentException(
                    "Account is already verified"
            );
        }

        String otp = generateOtp();

        user.setVerificationOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        /*
         * Send the new OTP first.
         *
         * If sending fails, the old OTP remains in the database.
         */
        emailService.sendOtpEmail(
                user.getEmail(),
                otp,
                "Account Verification"
        );

        userRepository.save(user);

        return "Verification OTP sent successfully.";
    }


    // ============================================================
    // VERIFY REGISTRATION OTP
    // ============================================================

    public AuthResponse verifyRegistration(
            VerifyOtpRequest request) {

        User user = findUser(request.email());

        if (user.isVerified()) {
            throw new IllegalArgumentException(
                    "Account is already verified"
            );
        }

        // Validate the OTP.
        validateOtp(
                user.getVerificationOtp(),
                user.getOtpExpiry(),
                request.otp()
        );

        // OTP is correct, so verify the account.
        user.setVerified(true);

        // OTP is no longer needed.
        user.setVerificationOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        // Generate JWT and log the user in.
        return createAuthResponse(user);
    }


    // ============================================================
    // LOGIN
    // ============================================================

    public AuthResponse login(LoginRequest request) {

        User user = findUser(request.email());

        // User must verify email before login.
        if (!user.isVerified()) {
            throw new IllegalArgumentException(
                    "Please verify your account before login"
            );
        }

        // Check password.
        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        return createAuthResponse(user);
    }


    // ============================================================
    // FORGOT PASSWORD
    // ============================================================

    public String forgotPassword(
            ForgotPasswordRequest request) {

        User user = findUser(request.email());

        String otp = generateOtp();

        user.setResetOtp(otp);

        user.setResetOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        /*
         * Send email first.
         *
         * We only save the new reset OTP if the email was sent
         * successfully.
         */
        emailService.sendOtpEmail(
                user.getEmail(),
                otp,
                "Password Reset"
        );

        userRepository.save(user);

        return "Password reset OTP sent.";
    }


    // ============================================================
    // RESET PASSWORD
    // ============================================================

    public String resetPassword(
            ResetPasswordRequest request) {

        if (!request.newPassword().equals(
                request.confirmPassword())) {

            throw new IllegalArgumentException(
                    "Passwords do not match"
            );
        }

        User user = findUser(request.email());

        // Validate password-reset OTP.
        validateOtp(
                user.getResetOtp(),
                user.getResetOtpExpiry(),
                request.otp()
        );

        // Encrypt the new password.
        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        // Remove used OTP.
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);

        return "Password reset successful. You can now login.";
    }


    // ============================================================
    // FIND USER
    // ============================================================

    private User findUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }


    // ============================================================
    // VALIDATE OTP
    // ============================================================

    private void validateOtp(
            String savedOtp,
            LocalDateTime expiry,
            String enteredOtp) {

        if (savedOtp == null || expiry == null) {

            throw new IllegalArgumentException(
                    "OTP not found"
            );
        }

        if (LocalDateTime.now().isAfter(expiry)) {

            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }

        if (!savedOtp.equals(enteredOtp)) {

            throw new IllegalArgumentException(
                    "Invalid OTP"
            );
        }
    }


    // ============================================================
    // GENERATE OTP
    // ============================================================

    private String generateOtp() {

        return String.format(
                "%06d",
                new Random().nextInt(1_000_000)
        );
    }


    // ============================================================
    // CREATE JWT RESPONSE
    // ============================================================

    private AuthResponse createAuthResponse(User user) {

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}