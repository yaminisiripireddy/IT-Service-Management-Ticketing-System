package com.itservicemanagement.service;

import com.itservicemanagement.enums.TicketPriority;
import com.itservicemanagement.enums.TicketStatus;
import com.itservicemanagement.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;

    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Map<String, Long> getStatistics() {

        Map<String, Long> statistics = new LinkedHashMap<>();

        statistics.put(
                "totalTickets",
                ticketRepository.count()
        );

        statistics.put(
                "openTickets",
                ticketRepository.countByStatus(TicketStatus.OPEN)
        );

        statistics.put(
                "inProgressTickets",
                ticketRepository.countByStatus(TicketStatus.IN_PROGRESS)
        );

        statistics.put(
                "resolvedTickets",
                ticketRepository.countByStatus(TicketStatus.RESOLVED)
        );

        statistics.put(
                "closedTickets",
                ticketRepository.countByStatus(TicketStatus.CLOSED)
        );

        statistics.put(
                "criticalTickets",
                ticketRepository.countByPriority(TicketPriority.CRITICAL)
        );

        return statistics;
    }
}