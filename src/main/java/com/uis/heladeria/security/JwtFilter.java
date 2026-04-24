package com.uis.heladeria.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Si no hay header Bearer, continuar sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // Quitar "Bearer "

        try {
            if (jwtUtil.isTokenValid(token)) {
                String email = jwtUtil.extractEmail(token);
                String rol   = jwtUtil.extractRol(token);

                // Crear autenticación con el rol del usuario
                var authority = new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase());
                var auth = new UsernamePasswordAuthenticationToken(
                        email, null, List.of(authority));

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            // Token inválido → continuar sin autenticar (la ruta protegida dará 401)
        }

        filterChain.doFilter(request, response);
    }
}