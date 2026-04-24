package com.uis.heladeria.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Clave secreta definida en application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Expiración: 24 horas en milisegundos
    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 24;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Genera un token JWT con email y rol del usuario */
    public String generateToken(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey())
                .compact();
    }

    /** Extrae todos los claims (datos) del token */
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** Extrae el email (subject) del token */
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    /** Extrae el rol del token */
    public String extractRol(String token) {
        return extractClaims(token).get("rol", String.class);
    }

    /** Valida que el token no haya expirado */
    public boolean isTokenValid(String token) {
        try {
            return extractClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}