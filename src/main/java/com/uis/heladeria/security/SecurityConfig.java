package com.uis.heladeria.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (usamos JWT, no sesiones)
            .csrf(AbstractHttpConfigurer::disable)

            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Sin sesiones en servidor (stateless)
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Reglas de acceso por ruta
            .authorizeHttpRequests(auth -> auth

                // ===== RUTAS PÚBLICAS =====
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/usuarios").permitAll()        // POST para registro
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()

                // Swagger / OpenAPI (útil para presentación)
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // Archivos estáticos del frontend (index.html, CSS, JS)
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/*.js",
                    "/*.css",
                    "/*.ico"
                ).permitAll()

                // ===== RUTAS SOLO ADMIN =====
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/api/usuarios").hasRole("ADMIN")

                // ===== RUTAS ADMIN Y EMPLEADO =====
                .requestMatchers("/api/pedidos/**").hasAnyRole("ADMIN", "EMPLEADO", "CLIENTE")
                .requestMatchers("/api/detalles-pedidos/**").hasAnyRole("ADMIN", "EMPLEADO", "CLIENTE")

                // ===== RESTO: requiere autenticación =====
                .anyRequest().authenticated()
            )

            // Insertar el filtro JWT antes del filtro de autenticación estándar
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}