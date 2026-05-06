package com.uis.heladeria.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.uis.heladeria.model.Pedido;

public interface PedidoRepository extends MongoRepository<Pedido, String> {

    // Busca por el id del usuario anidado (el campo @Id en Usuario se llama "id")
    List<Pedido> findByUsuario_IdOrderByFechaPedidoDesc(String id);

    // Pedidos por estado
    List<Pedido> findByEstadoOrderByFechaPedidoDesc(String estado);

    // Todos ordenados por fecha
    List<Pedido> findAllByOrderByFechaPedidoDesc();
}