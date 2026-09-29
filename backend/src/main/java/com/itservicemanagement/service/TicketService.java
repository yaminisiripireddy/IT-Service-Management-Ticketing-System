package com.itservicemanagement.service;

import com.itservicemanagement.dto.CommentRequest;
import com.itservicemanagement.dto.CommentResponse;
import com.itservicemanagement.dto.TicketRequest;
import com.itservicemanagement.dto.TicketResponse;
import com.itservicemanagement.entity.Ticket;
import com.itservicemanagement.entity.TicketComment;
import com.itservicemanagement.entity.User;
import com.itservicemanagement.enums.Role;
import com.itservicemanagement.enums.TicketPriority;
import com.itservicemanagement.enums.TicketStatus;
import com.itservicemanagement.repository.TicketCommentRepository;
import com.itservicemanagement.repository.TicketRepository;
import com.itservicemanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            TicketCommentRepository commentRepository,
            UserRepository userRepository) {

        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    /* =========================================================
       CREATE TICKET
       ========================================================= */

    public TicketResponse createTicket(
            TicketRequest request,
            String email) {

        User user = getUser(email);

        Ticket ticket = Ticket.builder()
                .title(request.title())
                .description(request.description())
                .priority(
                        request.priority() == null
                                ? TicketPriority.MEDIUM
                                : request.priority()
                )
                .status(TicketStatus.OPEN)
                .createdBy(user)
                .build();

        return toResponse(ticketRepository.save(ticket));
    }

    /* =========================================================
       GET TICKETS
       ========================================================= */

    public List<TicketResponse> getTickets(String email) {

        User user = getUser(email);

        List<Ticket> tickets;

        if (user.getRole() == Role.EMPLOYEE) {

            tickets = ticketRepository.findByCreatedById(
                    user.getId()
            );

        } else {

            tickets = ticketRepository.findAll();
        }

        return tickets.stream()
                .map(this::toResponse)
                .toList();
    }

    /* =========================================================
       GET SINGLE TICKET
       ========================================================= */

    public TicketResponse getTicket(
            Long id,
            String email) {

        Ticket ticket = getTicketEntity(id);

        User user = getUser(email);

        if (user.getRole() == Role.EMPLOYEE &&
                !ticket.getCreatedBy().getId().equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not allowed to view this ticket"
            );
        }

        return toResponse(ticket);
    }

    /* =========================================================
       UPDATE TICKET
       SUPPORT AGENT / ADMIN
       ========================================================= */

    public TicketResponse updateTicket(
            Long id,
            TicketRequest request) {

        Ticket ticket = getTicketEntity(id);

        if (request.title() != null &&
                !request.title().isBlank()) {

            ticket.setTitle(request.title());
        }

        if (request.description() != null &&
                !request.description().isBlank()) {

            ticket.setDescription(request.description());
        }

        if (request.priority() != null) {
            ticket.setPriority(request.priority());
        }

        return toResponse(
                ticketRepository.save(ticket)
        );
    }

    /* =========================================================
       UPDATE STATUS
       ========================================================= */

    public TicketResponse updateStatus(
            Long id,
            TicketStatus status) {

        Ticket ticket = getTicketEntity(id);

        ticket.setStatus(status);

        return toResponse(
                ticketRepository.save(ticket)
        );
    }

    /* =========================================================
       EMPLOYEE CLOSES RESOLVED TICKET
       ========================================================= */

    public TicketResponse closeTicket(
            Long id,
            String email) {

        Ticket ticket = getTicketEntity(id);

        User user = getUser(email);

        if (!ticket.getCreatedBy()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You can only close your own tickets"
            );
        }

        if (ticket.getStatus() != TicketStatus.RESOLVED) {

            throw new IllegalArgumentException(
                    "Only resolved tickets can be closed"
            );
        }

        ticket.setStatus(TicketStatus.CLOSED);

        return toResponse(
                ticketRepository.save(ticket)
        );
    }

    /* =========================================================
       UPDATE PRIORITY
       ========================================================= */

    public TicketResponse updatePriority(
            Long id,
            TicketPriority priority) {

        Ticket ticket = getTicketEntity(id);

        ticket.setPriority(priority);

        return toResponse(
                ticketRepository.save(ticket)
        );
    }

    /* =========================================================
       ASSIGN TICKET
       ========================================================= */

    public TicketResponse assignTicket(
            Long ticketId,
            Long userId) {

        Ticket ticket = getTicketEntity(ticketId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (user.getRole() != Role.SUPPORT_AGENT) {

            throw new IllegalArgumentException(
                    "Ticket can only be assigned to a support agent"
            );
        }

        ticket.setAssignedTo(user);

        return toResponse(
                ticketRepository.save(ticket)
        );
    }

    /* =========================================================
       DELETE TICKET
       ADMIN
       ========================================================= */

    public void deleteTicket(Long id) {

        Ticket ticket = getTicketEntity(id);

        ticketRepository.delete(ticket);
    }

    /* =========================================================
       ADD COMMENT
       ========================================================= */

    public CommentResponse addComment(
            Long ticketId,
            CommentRequest request,
            String email) {

        Ticket ticket = getTicketEntity(ticketId);

        User user = getUser(email);

        if (user.getRole() == Role.EMPLOYEE &&
                !ticket.getCreatedBy()
                        .getId()
                        .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You cannot comment on this ticket"
            );
        }

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .user(user)
                .comment(request.comment())
                .build();

        TicketComment saved =
                commentRepository.save(comment);

        return toCommentResponse(saved);
    }

    /* =========================================================
       GET COMMENTS
       ========================================================= */

    public List<CommentResponse> getComments(
            Long ticketId,
            String email) {

        Ticket ticket = getTicketEntity(ticketId);

        User user = getUser(email);

        if (user.getRole() == Role.EMPLOYEE &&
                !ticket.getCreatedBy()
                        .getId()
                        .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You cannot view comments for this ticket"
            );
        }

        return commentRepository
                .findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::toCommentResponse)
                .toList();
    }

    /* =========================================================
       HELPERS
       ========================================================= */

    private Ticket getTicketEntity(Long id) {

        return ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found"
                        )
                );
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    /* =========================================================
       TICKET RESPONSE
       ========================================================= */

    private TicketResponse toResponse(
            Ticket ticket) {

        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus().name(),
                ticket.getPriority().name(),

                ticket.getCreatedBy().getId(),
                ticket.getCreatedBy().getName(),

                ticket.getAssignedTo() != null
                        ? ticket.getAssignedTo().getId()
                        : null,

                ticket.getAssignedTo() != null
                        ? ticket.getAssignedTo().getName()
                        : null,

                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    /* =========================================================
       COMMENT RESPONSE
       ========================================================= */

    private CommentResponse toCommentResponse(
            TicketComment comment) {

        return new CommentResponse(
                comment.getId(),
                comment.getTicket().getId(),
                comment.getUser().getId(),
                comment.getUser().getName(),
                comment.getUser().getRole().name(),
                comment.getComment(),
                comment.getCreatedAt()
        );
    }
}