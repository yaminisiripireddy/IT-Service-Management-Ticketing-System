package com.itservicemanagement.dto;

import com.itservicemanagement.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;

public record TicketRequest(

        @NotBlank
        String title,

        @NotBlank
        String description,

        TicketPriority priority
) {
}