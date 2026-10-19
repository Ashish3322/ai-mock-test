package com.aiinterview.prep.service;

import com.aiinterview.prep.dto.*;
import com.aiinterview.prep.entity.User;
import java.util.Optional;
import com.aiinterview.prep.exception.BadRequestException;
import com.aiinterview.prep.exception.ResourceNotFoundException;
import com.aiinterview.prep.repository.UserRepository;
import com.aiinterview.prep.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_STUDENT");
        if (request.getTargetRole() != null && !request.getTargetRole().isBlank()) {
            user.setTargetRole(request.getTargetRole().trim());
        }

        User saved = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUsername(saved.getEmail());
        return new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), saved.getTargetRole());
    }

    public AuthResponse login(AuthRequest request) {
        String input = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        User targetUser = resolveUser(input);
        String authEmail = targetUser != null ? targetUser.getEmail() : input;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = targetUser != null ? targetUser : userRepository.findByEmail(authEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getTargetRole());
    }

    private User resolveUser(String input) {
        if (input == null || input.isBlank()) return null;
        Optional<User> direct = userRepository.findByEmail(input);
        if (direct.isPresent()) return direct.get();

        if (input.equals("admin") || input.startsWith("admin@")) {
            return userRepository.findByEmail("admin@aiinterview.com")
                    .or(() -> userRepository.findByEmail("admin@example.com"))
                    .or(() -> userRepository.findAll().stream().filter(u -> "ROLE_ADMIN".equalsIgnoreCase(u.getRole())).findFirst())
                    .orElse(null);
        }

        if (input.equals("student") || input.startsWith("student@")) {
            return userRepository.findByEmail("student@aiinterview.com")
                    .or(() -> userRepository.findByEmail("student@example.com"))
                    .orElse(null);
        }

        return userRepository.findAll().stream()
                .filter(u -> u.getEmail() != null && (
                        u.getEmail().equalsIgnoreCase(input) ||
                        u.getEmail().toLowerCase().startsWith(input + "@")
                ))
                .findFirst()
                .orElse(null);
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("No authenticated user found");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserProfileDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getTargetRole(), user.getCreatedAt());
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(request.getName().trim());
        user.setTargetRole(request.getTargetRole().trim());
        User saved = userRepository.save(user);
        return new UserProfileDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), saved.getTargetRole(), saved.getCreatedAt());
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
