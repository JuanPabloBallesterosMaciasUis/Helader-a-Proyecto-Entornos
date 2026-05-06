package com.uis.heladeria.repository;
 
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.uis.heladeria.model.DetallePedido;
 
public interface DetallePedidoRepository extends MongoRepository<DetallePedido, String> {
 
    // Detalles de un pedido por su id
    List<DetallePedido> findByPedido_IdPedido(String idPedido);
}