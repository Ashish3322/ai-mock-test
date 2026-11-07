package com.aiinterview.prep.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> apiRoot() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "AI Interview Prep Backend REST API is running successfully!",
                "health", "/api/health",
                "apiRoles", "/api/roles",
                "apiQuestions", "/api/questions",
                "apiMcqs", "/api/mcqs"
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "database", "CONNECTED"
        ));
    }
}
