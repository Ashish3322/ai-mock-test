package com.aiinterview.prep.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Forward single-page application routes to index.html for client-side routing
    @GetMapping(value = {
            "/questions",
            "/interview-questions",
            "/mcq",
            "/mcqs",
            "/features",
            "/about",
            "/login",
            "/register",
            "/dashboard",
            "/start-interview",
            "/interview/**",
            "/report/**",
            "/history",
            "/progress",
            "/profile",
            "/admin",
            "/admin/**"
    })
    public String forwardSpa() {
        return "forward:/index.html";
    }
}
