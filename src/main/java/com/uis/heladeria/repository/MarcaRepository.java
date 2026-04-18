package com.uis.heladeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uis.heladeria.model.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
}
