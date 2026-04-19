package com.uis.heladeria.model;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long idUsuario;

    private String nombre;
    private String email;
    private String contrasena;
    private String telefono;
    private String direccion;
    private String rol;
}
