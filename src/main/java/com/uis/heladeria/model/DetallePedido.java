package com.uis.heladeria.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "detalles_pedidos")
@Data
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
