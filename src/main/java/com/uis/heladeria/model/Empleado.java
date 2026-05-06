package com.uis.heladeria.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "empleados")
@Data
public class Empleado {

    @Id
    private String idEmpleado;      // String en MongoDB (era Long)

    // Usuario anidado como subdocumento
    private Usuario usuario;

    private String cargo;
    private Date fechaIngreso;
}