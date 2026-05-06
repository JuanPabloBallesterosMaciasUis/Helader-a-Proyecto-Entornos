package com.uis.heladeria.controller;

import com.uis.heladeria.model.Usuario;
import com.uis.heladeria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // GET todos
    @GetMapping
    public List<Usuario> getAll() {
        return repository.findAll();
    }

    // GET por ID  (id es String ahora)
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST crear
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Usuario usuario) {
        // Verificar email duplicado
        if (repository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El email ya está registrado"));
        }
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("CLIENTE");
        }
        return ResponseEntity.ok(repository.save(usuario));
    }

    // PUT actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable String id,
        @RequestBody Usuario datos) {
        return repository.findById(id).map(u -> {
            u.setNombre(datos.getNombre());
            u.setEmail(datos.getEmail());
            u.setTelefono(datos.getTelefono());
            u.setDireccion(datos.getDireccion());
            u.setRol(datos.getRol());
            if (datos.getContrasena() != null && !datos.getContrasena().isBlank()) {
                u.setContrasena(datos.getContrasena());
            }
            return ResponseEntity.ok(repository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}