package com.itservicemanagement.controller;

import com.itservicemanagement.dto.CommentRequest;
import com.itservicemanagement.dto.CommentResponse;
import com.itservicemanagement.dto.TicketRequest;
import com.itservicemanagement.dto.TicketResponse;
import com.itservicemanagement.enums.TicketPriority;
import com.itservicemanagement.enums.TicketStatus;
import com.itservicemanagement.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(
            TicketService ticketService) {

        this.ticketService = ticketService;
    }

    /* =========================================================
       CREATE
       EMPLOYEE / SUPPORT_AGENT / ADMIN
       ========================================================= */

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketRequest request,
            Authentication authentication) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ticketService.createTicket(
                                request,
                                authentication.getName()
                        )
                );
    }

    /* =========================================================
       GET ALL
       ========================================================= */

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets(
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getTickets(
                        authentication.getName()
                )
        );
    }

    /* =========================================================
       GET ONE
       ========================================================= */

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getTicket(
                        id,
                        authentication.getName()
                )
        );
    }

    /* =========================================================
       UPDATE
       SUPPORT_AGENT / ADMIN
       ========================================================= */

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('SUPPORT_AGENT', 'ADMIN')"
    )
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketRequest request) {

        return ResponseEntity.ok(
                ticketService.updateTicket(
                        id,
                        request
                )
        );
    }

    /* =========================================================
       STATUS
       SUPPORT_AGENT / ADMIN
       ========================================================= */

    @PutMapping("/{id}/status")
    @PreAuthorize(
            "hasAnyRole('SUPPORT_AGENT', 'ADMIN')"
    )
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {

        return ResponseEntity.ok(
                ticketService.updateStatus(
                        id,
                        status
                )
        );
    }

    /* =========================================================
       EMPLOYEE CLOSE
       ========================================================= */

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<TicketResponse> closeTicket(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.closeTicket(
                        id,
                        authentication.getName()
                )
        );
    }

    /* =========================================================
       PRIORITY
       SUPPORT_AGENT / ADMIN
       ========================================================= */

    @PutMapping("/{id}/priority")
    @PreAuthorize(
            "hasAnyRole('SUPPORT_AGENT', 'ADMIN')"
    )
    public ResponseEntity<TicketResponse> updatePriority(
            @PathVariable Long id,
            @RequestParam TicketPriority priority) {

        return ResponseEntity.ok(
                ticketService.updatePriority(
                        id,
                        priority
                )
        );
    }

    /* =========================================================
       ASSIGN
       SUPPORT_AGENT / ADMIN
       ========================================================= */

    @PutMapping("/{id}/assign")
    @PreAuthorize(
            "hasAnyRole('SUPPORT_AGENT', 'ADMIN')"
    )
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable Long id,
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                ticketService.assignTicket(
                        id,
                        userId
                )
        );
    }

    /* =========================================================
       DELETE
       ADMIN ONLY
       ========================================================= */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id) {

        ticketService.deleteTicket(id);

        return ResponseEntity.noContent().build();
    }

    /* =========================================================
       ADD COMMENT
       ========================================================= */

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ticketService.addComment(
                                id,
                                request,
                                authentication.getName()
                        )
                );
    }

    /* =========================================================
       GET COMMENTS
       ========================================================= */

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getComments(
                        id,
                        authentication.getName()
                )
        );
    }
}