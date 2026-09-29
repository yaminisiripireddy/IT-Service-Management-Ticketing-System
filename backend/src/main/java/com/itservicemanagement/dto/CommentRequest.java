package com.itservicemanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(

        @NotBlank
        String comment

) {
}