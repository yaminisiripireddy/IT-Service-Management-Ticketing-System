package com.itservicemanagement.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long ticketId,
        Long userId,
        String userName,
        String userRole,
        String comment,
        LocalDateTime createdAt
) {
}