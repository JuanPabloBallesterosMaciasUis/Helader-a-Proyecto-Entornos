package com.uis.heladeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uis.heladeria.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndContrasena(String email, String contrasena);
    Optional<Usuario> findByEmail(String email);
}
