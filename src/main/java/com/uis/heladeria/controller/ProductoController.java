package com.uis.heladeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uis.heladeria.model.Producto;
import com.uis.heladeria.repository.ProductoRepository;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository repository;

    // Obtiene todo el catálogo de helados
    @GetMapping
    public List<Producto> getAll() {
        return repository.findAll();
    }

    // Registra un nuevo producto en el inventario
    @PostMapping
    public Producto create(@RequestBody Producto entity) {
        return repository.save(entity);
    }

    // Busca detalles de un producto específico por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // Modifica o actualiza la información de un producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto details) {
        return repository.findById(id).map(entity -> {
            entity.setNombre(details.getNombre());
            entity.setDescripcion(details.getDescripcion());
            entity.setPrecio(details.getPrecio());
            entity.setStock(details.getStock());
            entity.setPresentacion(details.getPresentacion());
            entity.setMarca(details.getMarca());
            return ResponseEntity.ok(repository.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Elimina un producto del catálogo por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if(repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
