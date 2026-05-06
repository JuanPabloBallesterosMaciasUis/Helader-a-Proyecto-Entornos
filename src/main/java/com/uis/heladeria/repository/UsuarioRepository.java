package com.uis.heladeria.repository;
 
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.uis.heladeria.model.Usuario;
 
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByEmailAndContrasena(String email, String contrasena);
    Optional<Usuario> findByEmail(String email);
}