package com.uis.heladeria.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uis.heladeria.model.DetallePedido;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    // Todos los detalles de un pedido específico
    List<DetallePedido> findByPedido_IdPedido(Long idPedido);
}