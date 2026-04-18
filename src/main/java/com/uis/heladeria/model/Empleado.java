package com.uis.heladeria.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "empleados")
@Data
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uniqueId;

    private Long idEmpleado;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    private String cargo;
    private Date fechaIngreso;
}
