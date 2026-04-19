package com.uis.heladeria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.uis.heladeria.model.Usuario;
import com.uis.heladeria.repository.UsuarioRepository;

@SpringBootApplication
public class HeladeriaApplication {

	public static void main(String[] args) {
		SpringApplication.run(HeladeriaApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(UsuarioRepository usuarioRepository) {
		return args -> {
			if (usuarioRepository.findByEmail("admin@heladeria.com").isEmpty()) {
				Usuario admin = new Usuario();
				admin.setNombre("Administrador");
				admin.setEmail("admin@heladeria.com");
				admin.setContrasena("admin123");
				admin.setTelefono("3150000000");
				admin.setDireccion("Calle de los sabores 1");
				admin.setRol("ADMIN");
				usuarioRepository.save(admin);
				System.out.println("===> Usuario Administrador creado exitosamente para pruebas <===");
			}
		};
	}
}
