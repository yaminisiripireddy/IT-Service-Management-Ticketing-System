package com.itservicemanagement.repository;

import com.itservicemanagement.entity.Ticket;
import com.itservicemanagement.enums.TicketPriority;
import com.itservicemanagement.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCreatedById(Long userId);

    List<Ticket> findByAssignedToId(Long userId);

    List<Ticket> findByStatus(TicketStatus status);

    long countByStatus(TicketStatus status);

    long countByPriority(TicketPriority priority);
}