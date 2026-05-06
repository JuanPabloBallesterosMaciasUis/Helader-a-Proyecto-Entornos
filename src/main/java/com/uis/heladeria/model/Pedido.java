package com.uis.heladeria.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "pedidos")
@Data
public class Pedido {

    @Id
    private String idPedido;        // String en MongoDB (era Long)

    // Usuario anidado como subdocumento
    private Usuario usuario;

    private Date fechaPedido;
    private String estado;          // PENDIENTE, DESPACHADO
    private Double total;
    private String direccionEntrega;
}