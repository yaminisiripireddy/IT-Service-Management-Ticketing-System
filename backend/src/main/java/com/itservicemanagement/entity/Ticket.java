package com.itservicemanagement.entity;

import com.itservicemanagement.enums.TicketPriority;
import com.itservicemanagement.enums.TicketStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Ticket() {
    }

    public Ticket(
            Long id,
            String title,
            String description,
            TicketStatus status,
            TicketPriority priority,
            User createdBy,
            User assignedTo,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = TicketStatus.OPEN;
        }

        if (priority == null) {
            priority = TicketPriority.MEDIUM;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static TicketBuilder builder() {
        return new TicketBuilder();
    }

    public static class TicketBuilder {

        private Long id;
        private String title;
        private String description;
        private TicketStatus status;
        private TicketPriority priority;
        private User createdBy;
        private User assignedTo;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TicketBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TicketBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TicketBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TicketBuilder status(TicketStatus status) {
            this.status = status;
            return this;
        }

        public TicketBuilder priority(TicketPriority priority) {
            this.priority = priority;
            return this;
        }

        public TicketBuilder createdBy(User createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public TicketBuilder assignedTo(User assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public TicketBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TicketBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Ticket build() {
            return new Ticket(
                    id,
                    title,
                    description,
                    status,
                    priority,
                    createdBy,
                    assignedTo,
                    createdAt,
                    updatedAt
            );
        }
    }
}