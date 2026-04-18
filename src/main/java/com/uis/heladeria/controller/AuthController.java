package com.uis.heladeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uis.heladeria.repository.UsuarioRepository;
import com.uis.heladeria.model.Usuario;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String contrasena = credenciales.get("contrasena");

        Optional<Usuario> user = usuarioRepository.findByEmailAndContrasena(email, contrasena);

        if(user.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Login exitoso", "usuario", user.get()));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
    }
}
