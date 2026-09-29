package com.itservicemanagement.service;

import com.itservicemanagement.entity.User;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(
            String email,
            String otp,
            String purpose) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        String subject;

        if ("Password Reset".equalsIgnoreCase(purpose)) {
            subject = "IT Service Management - Password Reset OTP";
        } else {
            subject = "IT Service Management - Account Verification OTP";
        }

        message.setSubject(subject);

        message.setText(
                "IT SERVICE MANAGEMENT\n"
                + "============================\n\n"

                + purpose + "\n\n"

                + "Hello,\n\n"

                + "We received a request related to your account "
                + "on the IT Service Management application.\n\n"

                + "Your One-Time Password (OTP) is:\n\n"

                + "        " + otp + "\n\n"

                + "This OTP is valid for 1 minute only.\n\n"

                + "For your security, please do not share this OTP "
                + "with anyone.\n\n"

                + "If you did not request this OTP, you can safely "
                + "ignore this email.\n\n"

                + "Regards,\n"
                + "IT Service Management Team\n"
                + "IT Service Management System"
        );

        mailSender.send(message);
    }
}