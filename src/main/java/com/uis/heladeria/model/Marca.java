package com.uis.heladeria.model;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "marcas")
@Data
public class Marca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMarca;

    private String nombre;
    private String pais;
    private String email;
    private String telefono;
}
