package com.uis.heladeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uis.heladeria.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
