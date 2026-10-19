package com.aiinterview.prep.security;

import com.aiinterview.prep.entity.User;
import com.aiinterview.prep.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String cleanEmail = email != null ? email.trim().toLowerCase() : "";
        User user = userRepository.findByEmail(cleanEmail)
                .or(() -> {
                    if (cleanEmail.equals("admin") || cleanEmail.startsWith("admin@")) {
                        return userRepository.findByEmail("admin@aiinterview.com")
                                .or(() -> userRepository.findByEmail("admin@example.com"))
                                .or(() -> userRepository.findAll().stream().filter(u -> "ROLE_ADMIN".equalsIgnoreCase(u.getRole())).findFirst());
                    }
                    if (cleanEmail.equals("student") || cleanEmail.startsWith("student@")) {
                        return userRepository.findByEmail("student@aiinterview.com")
                                .or(() -> userRepository.findByEmail("student@example.com"));
                    }
                    return userRepository.findAll().stream()
                            .filter(u -> u.getEmail() != null && (
                                    u.getEmail().trim().equalsIgnoreCase(cleanEmail) ||
                                    u.getEmail().toLowerCase().startsWith(cleanEmail + "@")
                            ))
                            .findFirst();
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        String role = user.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_STUDENT";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}
