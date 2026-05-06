package com.uis.heladeria.repository;
 
import org.springframework.data.mongodb.repository.MongoRepository;

import com.uis.heladeria.model.Producto;
 
public interface ProductoRepository extends MongoRepository<Producto, String> {
}