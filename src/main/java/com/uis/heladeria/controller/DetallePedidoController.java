package com.uis.heladeria.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uis.heladeria.model.DetallePedido;
import com.uis.heladeria.repository.DetallePedidoRepository;

@RestController
@RequestMapping("/api/detalles-pedidos")
@CrossOrigin(origins = "*")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoRepository repository;

    // Todos los detalles (admin)
    @GetMapping
    public List<DetallePedido> getAll() {
        return repository.findAll();
    }

    // Detalles de un pedido específico
    @GetMapping("/pedido/{idPedido}")
    public List<DetallePedido> getByPedido(@PathVariable String idPedido) {
        return repository.findByPedido_IdPedido(idPedido);
    }

    // Crea un detalle (ítem del carrito)
    @PostMapping
    public ResponseEntity<DetallePedido> create(@RequestBody DetallePedido detalle) {
        return ResponseEntity.ok(repository.save(detalle));
    }

    // Obtiene un detalle por ID
    @GetMapping("/{id}")
    public ResponseEntity<DetallePedido> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Elimina un detalle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}