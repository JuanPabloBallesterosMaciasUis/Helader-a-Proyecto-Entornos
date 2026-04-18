package com.uis.heladeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uis.heladeria.model.Marca;
import com.uis.heladeria.repository.MarcaRepository;
import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    @Autowired
    private MarcaRepository repository;

    @GetMapping
    public List<Marca> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Marca create(@RequestBody Marca entity) {
        return repository.save(entity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> update(@PathVariable Long id, @RequestBody Marca details) {
        return repository.findById(id).map(entity -> {
            entity.setNombre(details.getNombre());
            entity.setPais(details.getPais());
            entity.setEmail(details.getEmail());
            entity.setTelefono(details.getTelefono());
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
