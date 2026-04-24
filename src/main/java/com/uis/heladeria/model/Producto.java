package com.uis.heladeria.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

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
    
    @Column(columnDefinition = "TEXT")
    private String imagen;

    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String presentacion;
}
