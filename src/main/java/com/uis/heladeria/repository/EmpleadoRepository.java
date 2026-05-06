package com.uis.heladeria.repository;
 
import org.springframework.data.mongodb.repository.MongoRepository;

import com.uis.heladeria.model.Empleado;
 
public interface EmpleadoRepository extends MongoRepository<Empleado, String> {
}