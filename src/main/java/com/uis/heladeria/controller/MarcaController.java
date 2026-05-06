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

    // Obtiene todas las marcas disponibles en la base de datos
    @GetMapping
    public List<Marca> getAll() {
        return repository.findAll();
    }

    // Registra una nueva marca
    @PostMapping
    public Marca create(@RequestBody Marca entity) {
        return repository.save(entity);
    }

    // Busca una marca específica por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Marca> getById(@PathVariable String id) {
        return repository.findById(id).map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // Actualiza los datos de una marca existente
    @PutMapping("/{id}")
    public ResponseEntity<Marca> update(@PathVariable String id, @RequestBody Marca details) {
        return repository.findById(id).map(entity -> {
            entity.setNombre(details.getNombre());
            entity.setPais(details.getPais());
            entity.setEmail(details.getEmail());
            entity.setTelefono(details.getTelefono());
            return ResponseEntity.ok(repository.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Elimina una marca por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if(repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
