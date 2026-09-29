package com.itservicemanagement.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comments")
public class TicketComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public TicketComment() {
    }

    public TicketComment(
            Long id,
            Ticket ticket,
            User user,
            String comment,
            LocalDateTime createdAt) {

        this.id = id;
        this.ticket = ticket;
        this.user = user;
        this.comment = comment;
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

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static TicketCommentBuilder builder() {
        return new TicketCommentBuilder();
    }

    public static class TicketCommentBuilder {

        private Long id;
        private Ticket ticket;
        private User user;
        private String comment;
        private LocalDateTime createdAt;

        public TicketCommentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TicketCommentBuilder ticket(Ticket ticket) {
            this.ticket = ticket;
            return this;
        }

        public TicketCommentBuilder user(User user) {
            this.user = user;
            return this;
        }

        public TicketCommentBuilder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public TicketCommentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TicketComment build() {
            return new TicketComment(
                    id,
                    ticket,
                    user,
                    comment,
                    createdAt
            );
        }
    }
}