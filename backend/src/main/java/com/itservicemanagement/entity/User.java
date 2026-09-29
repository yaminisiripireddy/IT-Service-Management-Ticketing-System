package com.itservicemanagement.entity;

import com.itservicemanagement.enums.Role;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String mobileNumber;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean verified;

    private String verificationOtp;

    private LocalDateTime otpExpiry;

    private String resetOtp;

    private LocalDateTime resetOtpExpiry;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public User() {
    }

    public User(
            Long id,
            String name,
            String email,
            String mobileNumber,
            String password,
            Role role,
            boolean verified,
            String verificationOtp,
            LocalDateTime otpExpiry,
            String resetOtp,
            LocalDateTime resetOtpExpiry,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.password = password;
        this.role = role;
        this.verified = verified;
        this.verificationOtp = verificationOtp;
        this.otpExpiry = otpExpiry;
        this.resetOtp = resetOtp;
        this.resetOtpExpiry = resetOtpExpiry;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getVerificationOtp() {
        return verificationOtp;
    }

    public void setVerificationOtp(String verificationOtp) {
        this.verificationOtp = verificationOtp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public String getResetOtp() {
        return resetOtp;
    }

    public void setResetOtp(String resetOtp) {
        this.resetOtp = resetOtp;
    }

    public LocalDateTime getResetOtpExpiry() {
        return resetOtpExpiry;
    }

    public void setResetOtpExpiry(LocalDateTime resetOtpExpiry) {
        this.resetOtpExpiry = resetOtpExpiry;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {

        private Long id;
        private String name;
        private String email;
        private String mobileNumber;
        private String password;
        private Role role;
        private boolean verified;
        private String verificationOtp;
        private LocalDateTime otpExpiry;
        private String resetOtp;
        private LocalDateTime resetOtpExpiry;
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder mobileNumber(String mobileNumber) {
            this.mobileNumber = mobileNumber;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserBuilder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public UserBuilder verificationOtp(String verificationOtp) {
            this.verificationOtp = verificationOtp;
            return this;
        }

        public UserBuilder otpExpiry(LocalDateTime otpExpiry) {
            this.otpExpiry = otpExpiry;
            return this;
        }

        public UserBuilder resetOtp(String resetOtp) {
            this.resetOtp = resetOtp;
            return this;
        }

        public UserBuilder resetOtpExpiry(LocalDateTime resetOtpExpiry) {
            this.resetOtpExpiry = resetOtpExpiry;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public User build() {
            return new User(
                    id,
                    name,
                    email,
                    mobileNumber,
                    password,
                    role,
                    verified,
                    verificationOtp,
                    otpExpiry,
                    resetOtp,
                    resetOtpExpiry,
                    createdAt
            );
        }
    }
}