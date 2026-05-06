package com.uis.heladeria.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "usuarios")
@Data                          // ← esto genera todos los getters y setters
public class Usuario {

    @Id
    private String id;

    private String nombre;

    @Indexed(unique = true)
    private String email;

    private String contrasena;
    private String telefono;
    private String direccion;
    private String rol;
}