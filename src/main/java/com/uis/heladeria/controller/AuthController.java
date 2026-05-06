package com.uis.heladeria.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email      = credenciales.get("email");
        String contrasena = credenciales.get("contrasena");

        // Busca solo por email
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);

        // Verifica que exista Y que la contraseña coincida (BCrypt)
        if (userOpt.isPresent() && passwordEncoder.matches(contrasena, userOpt.get().getContrasena())) {
            Usuario usuario = userOpt.get();

            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());

            return ResponseEntity.ok(Map.of(
                "message", "Login exitoso",
                "token",   token,
                "usuario", usuario
            ));
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Credenciales inválidas"));
    }

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