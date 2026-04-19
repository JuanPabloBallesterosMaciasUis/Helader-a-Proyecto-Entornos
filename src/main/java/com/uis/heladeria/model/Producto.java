package com.uis.heladeria.model;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "productos")
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long idProducto;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca marca;

    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String presentacion;
}
