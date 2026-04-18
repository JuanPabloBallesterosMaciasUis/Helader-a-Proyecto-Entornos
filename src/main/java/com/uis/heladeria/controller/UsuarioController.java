package com.uis.heladeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uis.heladeria.model.Usuario;
import com.uis.heladeria.repository.UsuarioRepository;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Usuario create(@RequestBody Usuario entity) {
        return repository.save(entity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody Usuario details) {
        return repository.findById(id).map(entity -> {
            entity.setNombre(details.getNombre());
            entity.setEmail(details.getEmail());
            entity.setContrasena(details.getContrasena());
            entity.setTelefono(details.getTelefono());
            entity.setDireccion(details.getDireccion());
            entity.setRol(details.getRol());
            return ResponseEntity.ok(repository.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if(repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
