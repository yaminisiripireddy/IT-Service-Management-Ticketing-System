package com.itservicemanagement.controller;

import com.itservicemanagement.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        return ResponseEntity.ok(
                dashboardService.getStatistics()
        );
    }
}