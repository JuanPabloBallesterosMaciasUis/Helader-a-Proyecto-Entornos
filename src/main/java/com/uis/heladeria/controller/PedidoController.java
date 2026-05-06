package com.uis.heladeria.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uis.heladeria.model.Pedido;
import com.uis.heladeria.repository.PedidoRepository;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository repository;

    // Obtiene todos los pedidos (para empleado/admin)
    @GetMapping
    public List<Pedido> getAll() {
        return repository.findAllByOrderByFechaPedidoDesc();
    }

    // Pedidos de un usuario específico (para cliente)
    @GetMapping("/usuario/{idUsuario}")
    public List<Pedido> getByUsuario(@PathVariable String idUsuario) {
        return repository.findByUsuario_IdOrderByFechaPedidoDesc(idUsuario);
    }

    // Pedidos filtrados por estado (PENDIENTE, DESPACHADO)
    @GetMapping("/estado/{estado}")
    public List<Pedido> getByEstado(@PathVariable String estado) {
        return repository.findByEstadoOrderByFechaPedidoDesc(estado);
    }

    // Crea un nuevo pedido desde el carrito del cliente
    @PostMapping
    public ResponseEntity<Pedido> create(@RequestBody Pedido pedido) {
        pedido.setFechaPedido(new Date());
        pedido.setEstado("PENDIENTE");
        return ResponseEntity.ok(repository.save(pedido));
    }

    // Obtiene un pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Empleado actualiza el estado del pedido (PENDIENTE → DESPACHADO)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> updateEstado(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return repository.findById(id).map(pedido -> {
            pedido.setEstado(nuevoEstado.toUpperCase());
            return ResponseEntity.ok(repository.save(pedido));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Elimina un pedido (solo admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}