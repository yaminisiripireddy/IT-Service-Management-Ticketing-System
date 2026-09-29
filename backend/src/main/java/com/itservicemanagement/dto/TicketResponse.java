package com.itservicemanagement.dto;

import java.time.LocalDateTime;

public record TicketResponse(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        Long createdById,
        String createdByName,
        Long assignedToId,
        String assignedToName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}