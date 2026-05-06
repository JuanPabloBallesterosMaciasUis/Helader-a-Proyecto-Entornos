package com.uis.heladeria.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "marcas")
@Data
public class Marca {

    @Id
    private String idMarca;         // String en MongoDB (era Long)

    private String nombre;
    private String pais;
    private String email;
    private String telefono;
}
