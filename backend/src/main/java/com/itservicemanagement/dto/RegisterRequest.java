package com.itservicemanagement.dto;

import com.itservicemanagement.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        String name,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(
                regexp = "^[6-9][0-9]{9}$",
                message = "Enter a valid 10-digit mobile number"
        )
        String mobileNumber,

        @NotBlank
        @Size(
                min = 8,
                message = "Password must contain at least 8 characters"
        )
        String password,

        @NotBlank
        String confirmPassword,

        Role role,

        String adminCode

) {}