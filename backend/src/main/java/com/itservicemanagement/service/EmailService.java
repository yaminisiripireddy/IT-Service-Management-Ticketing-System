package com.itservicemanagement.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    /*
     * DEVELOPMENT OTP SERVICE
     *
     * For local development, we do not depend on Gmail SMTP.
     * The generated OTP is printed in the Spring Boot console.
     *
     * Later, this class can be replaced with Gmail OAuth 2.0
     * without changing the registration/verification flow.
     */
    public void sendOtpEmail(
            String email,
            String otp,
            String purpose) {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("        IT SERVICE MANAGEMENT - OTP");
        System.out.println("==============================================");
        System.out.println("Purpose : " + purpose);
        System.out.println("Email   : " + email);
        System.out.println("OTP     : " + otp);
        System.out.println("Valid   : 5 minutes");
        System.out.println("==============================================");
        System.out.println();
    }
}