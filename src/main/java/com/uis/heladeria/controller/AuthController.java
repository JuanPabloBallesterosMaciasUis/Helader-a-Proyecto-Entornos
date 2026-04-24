package com.uis.heladeria.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uis.heladeria.model.Usuario;
import com.uis.heladeria.repository.UsuarioRepository;
import com.uis.heladeria.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email     = credenciales.get("email");
        String contrasena = credenciales.get("contrasena");

        Optional<Usuario> userOpt =
                usuarioRepository.findByEmailAndContrasena(email, contrasena);

        if (userOpt.isPresent()) {
            Usuario usuario = userOpt.get();

            // Generar token JWT con email y rol
            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());

            return ResponseEntity.ok(Map.of(
                "message", "Login exitoso",
                "token",   token,           // <-- nuevo: el frontend lo guarda
                "usuario", usuario
            ));
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Credenciales inválidas"));
    }

    /** Endpoint para verificar si un token sigue siendo válido */
    @GetMapping("/verificar")
    public ResponseEntity<?> verificar(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Token no proporcionado"));
        }
        String token = authHeader.substring(7);
        if (jwtUtil.isTokenValid(token)) {
            return ResponseEntity.ok(Map.of(
                "email", jwtUtil.extractEmail(token),
                "rol",   jwtUtil.extractRol(token)
            ));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Token expirado o inválido"));
    }
}
