package com.uis.heladeria.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "productos")
@Data
public class Producto {

    @Id
    private String idProducto;      // String en MongoDB (era Long)

    // En MongoDB se anida el objeto directamente como subdocumento.
    // Cuando crees/edites un producto envías: { "marca": { "idMarca": "abc123" } }
    private Marca marca;

    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String presentacion;
    private String imagen;          // Base64 de la imagen
}