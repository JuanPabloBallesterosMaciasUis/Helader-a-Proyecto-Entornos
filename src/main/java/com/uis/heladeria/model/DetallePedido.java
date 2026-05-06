package com.uis.heladeria.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "detalles_pedidos")
@Data
public class DetallePedido {

    @Id
    private String idDetalle;       // String en MongoDB (era Long)

    // Pedido y Producto anidados como subdocumentos
    private Pedido pedido;
    private Producto producto;

    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}