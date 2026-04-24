package com.uis.heladeria.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uis.heladeria.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Todos los pedidos de un usuario específico
    List<Pedido> findByUsuario_IdUsuarioOrderByFechaPedidoDesc(Long idUsuario);

    // Pedidos por estado (PENDIENTE, DESPACHADO)
    List<Pedido> findByEstadoOrderByFechaPedidoDesc(String estado);

    // Todos los pedidos ordenados por fecha descendente
    List<Pedido> findAllByOrderByFechaPedidoDesc();
}