package com.uis.heladeria.repository;
 
import org.springframework.data.mongodb.repository.MongoRepository;

import com.uis.heladeria.model.Marca;
 
public interface MarcaRepository extends MongoRepository<Marca, String> {
}