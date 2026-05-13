#  FrostHub — Plataforma de Gestión de Helados

> **Proyecto FullStack · Universidad Industrial de Santander**
> Ingeniería de Sistemas · Curso de Entornos de Programación



---

##  Descripción

**FrostHub** es una aplicación web FullStack para la gestión de una heladería de helados pre-empacados. Permite a los clientes explorar el catálogo, realizar pedidos con dirección de entrega y hacer seguimiento del estado. Los empleados gestionan y despachan pedidos, mientras que el administrador controla todo el sistema: usuarios, marcas, productos y pedidos.

### 🌐 URLs de producción

| Servicio | URL |
|---|---|
| Frontend (Vercel) | https://heladeria-proyecto-entornos.vercel.app |
| Backend API (Render) | https://helader-a-proyecto-entornos.onrender.com/api |
| Swagger UI | https://helader-a-proyecto-entornos.onrender.com/swagger-ui/index.html |



---



**MongoDB:**
```json
// Un solo documento con todo incluido
{
  "_id": "64abc123ef456",
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "rol": "CLIENTE",
  "pedidos": [
    { "total": 15000, "estado": "ENVIADO", "direccionEntrega": "Calle 45" }
  ]
}
```

---

##  Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                             │
│         Navegador web (Chrome, Firefox, Safari)              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND — Vercel                               │
│         React 18 + Vite + React Router v6                   │
│                                                              │
│  /                → LandingPage   (pública)                  │
│  /login           → LoginPage     (pública)                  │
│  /dashboard/*     → Panel según rol (protegido con JWT)      │
│    ├── /catalogo  → CatalogoPage  (cliente)                  │
│    ├── /pedidos   → PedidosPage   (cliente / empleado)       │
│    ├── /usuarios  → UsuariosPage  (admin)                    │
│    ├── /marcas    → MarcasPage    (admin)                    │
│    └── /productos → ProductosPage (admin)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST + JWT Bearer Token
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND — Render                                │
│         Spring Boot 4 · Java 17 · Puerto 8080               │
│                                                              │
│  POST /api/auth/login          → Genera JWT                  │
│  GET  /api/productos           → Público (sin token)         │
│  GET  /api/marcas              → Público (sin token)         │
│  CRUD /api/usuarios            → Solo ADMIN                  │
│  CRUD /api/marcas              → Solo ADMIN                  │
│  CRUD /api/productos           → Solo ADMIN                  │
│  CRUD /api/pedidos             → ADMIN + EMPLEADO + CLIENTE  │
│  CRUD /api/detalles-pedidos    → ADMIN + EMPLEADO + CLIENTE  │
│                                                              │
│  Spring Security + JWT Filter + BCrypt                       │
└────────────────────────┬────────────────────────────────────┘
                         │ Spring Data MongoDB
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS — MongoDB Atlas (Nube)            │
│         Cluster M0 Gratuito · Región: us-east-1             │
│                                                              │
│  Colecciones:                                                │
│  ├── usuarios         (nombre, email, rol, dirección...)     │
│  ├── marcas           (nombre, país, email, teléfono)        │
│  ├── productos        (nombre, precio, stock, imagen...)     │
│  ├── pedidos          (usuario, estado, total, dirección)    │
│  └── detalles_pedidos (pedido, producto, cantidad, subtotal) │
└─────────────────────────────────────────────────────────────┘
```

---

##  Flujo de Autenticación JWT

```
Cliente                    Backend                    MongoDB
   │                          │                          │
   │── POST /api/auth/login ──▶│                          │
   │   { email, contraseña }   │── findByEmailAndContr. ──▶│
   │                          │◀─── Usuario encontrado ───│
   │                          │─── genera JWT (24h) ──── │
   │◀── { token, usuario } ───│                          │
   │                          │                          │
   │  Guarda token en         │                          │
   │  localStorage            │                          │
   │                          │                          │
   │── GET /api/pedidos ──────▶│                          │
   │   Authorization: Bearer  │── verifica JWT ──────────│
   │   eyJhbGc...             │── findAll() ─────────────▶│
   │◀── [ lista pedidos ] ────│◀── documentos ────────────│
```

---

##  Estructura del Proyecto

```
Helader-a-Proyecto-Entornos/
│
├── frontend/                          ← React + Vite
│   ├── src/
│   │   ├── api.js                     ← apiFetch con JWT automático
│   │   ├── App.jsx                    ← Rutas y layout por rol
│   │   ├── main.jsx                   ← Entry point de React
│   │   ├── index.css                  ← Estilos globales (variables CSS)
│   │   ├── hooks/
│   │   │   └── useToast.jsx           ← Hook de notificaciones
│   │   └── pages/
│   │       ├── LandingPage.jsx        ← Página pública con carrusel
│   │       ├── LoginPage.jsx          ← Login + registro de cliente
│   │       ├── CatalogoPage.jsx       ← Tienda con filtros y carrito
│   │       ├── ProductosPage.jsx      ← CRUD de productos (admin)
│   │       ├── MarcasPage.jsx         ← CRUD de marcas (admin)
│   │       ├── UsuariosPage.jsx       ← CRUD de usuarios (admin)
│   │       └── PedidosPage.jsx        ← Gestión pedidos (emp/cliente)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── src/main/java/com/uis/heladeria/  ← Spring Boot
    ├── HeladeriaApplication.java      ← Main
    ├── DataSeeder.java                ← Crea usuarios por defecto
    ├── controller/
    │   ├── AuthController.java        ← Login → JWT
    │   ├── UsuarioController.java     ← CRUD usuarios
    │   ├── MarcaController.java       ← CRUD marcas
    │   ├── ProductoController.java    ← CRUD productos
    │   ├── PedidoController.java      ← CRUD + cambio de estado
    │   └── DetallePedidoController.java
    ├── model/
    │   ├── Usuario.java               ← @Document MongoDB
    │   ├── Marca.java
    │   ├── Producto.java
    │   ├── Pedido.java
    │   └── DetallePedido.java
    ├── repository/
    │   ├── UsuarioRepository.java     ← MongoRepository<Usuario, String>
    │   ├── MarcaRepository.java
    │   ├── ProductoRepository.java
    │   ├── PedidoRepository.java
    │   └── DetallePedidoRepository.java
    └── security/
        ├── JwtUtil.java               ← Genera y valida tokens
        ├── JwtFilter.java             ← Filtro por cada request
        └── SecurityConfig.java        ← Reglas de acceso por ruta
```

---

##  Roles y Permisos

| Funcionalidad | Público | Cliente | Empleado | Admin |
|---|:---:|:---:|:---:|:---:|
| Ver landing page | ✅ | ✅ | ✅ | ✅ |
| Ver catálogo de productos | ✅ | ✅ | ✅ | ✅ |
| Registrarse | ✅ | — | — | — |
| Agregar al carrito | ❌ | ✅ | ❌ | ❌ |
| Realizar pedido | ❌ | ✅ | ❌ | ❌ |
| Ver mis pedidos | ❌ | ✅ | ❌ | ❌ |
| Ver todos los pedidos | ❌ | ❌ | ✅ | ✅ |
| Confirmar / Enviar pedido | ❌ | ❌ | ✅ | ✅ |
| CRUD Productos | ❌ | ❌ | ❌ | ✅ |
| CRUD Marcas | ❌ | ❌ | ❌ | ✅ |
| CRUD Usuarios | ❌ | ❌ | ❌ | ✅ |

---

##  Flujo de un Pedido

```
CLIENTE                    EMPLEADO
   │                          │
   │  1. Explora catálogo      │
   │  2. Agrega al carrito     │
   │  3. Ingresa dirección     │
   │  4. Confirma pedido       │
   │     → Estado: PENDIENTE   │
   │                          │
   │                          │  5. Ve pedido PENDIENTE
   │                          │  6. Revisa detalles
   │                          │  7. Cambia → CONFIRMADO
   │                          │  8. Cambia → ENVIADO
   │                          │
   │  9. Ve estado actualizado │
   │     🚚 "¡En camino!"      │
   │                          │
```

---

##  Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3.1 | Framework de UI |
| Vite | 5.3.1 | Bundler y servidor de desarrollo |
| React Router DOM | 6.23.1 | Navegación SPA |
| CSS Variables | — | Sistema de diseño y temas |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Spring Boot | 4.0.5 | Framework principal |
| Spring Security | 7.x | Autenticación y autorización |
| Spring Data MongoDB | — | ORM para MongoDB |
| jjwt | 0.12.6 | Generación y validación de JWT |
| Lombok | — | Reducción de código boilerplate |
| Springdoc OpenAPI | 2.3.0 | Documentación Swagger |

### Infraestructura
| Servicio | Plan | Uso |
|---|---|---|
| MongoDB Atlas | M0 (Gratuito) | Base de datos en la nube |
| Render | Free | Hosting del backend |
| Vercel | Hobby (Gratuito) | Hosting del frontend |
| GitHub | — | Control de versiones |

---

##  Cómo ejecutar localmente

### Requisitos previos
- Java 17+
- Node.js 18+
- Cuenta en MongoDB Atlas

### 1. Clonar el repositorio
```bash
git clone https://github.com/JuanPabloBallesterosMaciasUis/Helader-a-Proyecto-Entornos.git
cd Helader-a-Proyecto-Entornos
```

### 2. Configurar el Backend

Editar `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://usuario:password@cluster.mongodb.net/heladeria
spring.data.mongodb.database=heladeria
server.port=8083
jwt.secret=frosthub-heladeria-uis-secret-key-2025
```

Ejecutar:
```bash
./gradlew bootRun
# Backend disponible en http://localhost:8083
```

### 3. Configurar el Frontend

Crear `frontend/.env`:
```env
VITE_API_URL=http://localhost:8083
```

Ejecutar:
```bash
cd frontend
npm install
npm run dev
# Frontend disponible en http://localhost:5173
```

### 4. Usuarios por defecto (DataSeeder)

Al arrancar el backend por primera vez se crean automáticamente:

| Email | Contraseña | Rol |
|---|---|---|
| admin@heladeria.com | admin123 | ADMIN |
| empleado@heladeria.com | empleado123 | EMPLEADO |

Los clientes se registran desde la pantalla de login.

---

##  Endpoints del API

### Autenticación (Público)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login → devuelve JWT |
| GET | `/api/auth/verificar` | Verifica si el token es válido |

### Usuarios
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/usuarios` | ADMIN | Listar todos |
| POST | `/api/usuarios` | Público | Registrar cliente |
| PUT | `/api/usuarios/{id}` | ADMIN | Actualizar |
| DELETE | `/api/usuarios/{id}` | ADMIN | Eliminar |

### Marcas
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/marcas` | Público | Listar todas |
| POST | `/api/marcas` | ADMIN | Crear |
| PUT | `/api/marcas/{id}` | ADMIN | Actualizar |
| DELETE | `/api/marcas/{id}` | ADMIN | Eliminar |

### Productos
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/productos` | Público | Listar todos |
| POST | `/api/productos` | ADMIN | Crear con imagen |
| PUT | `/api/productos/{id}` | ADMIN | Actualizar |
| DELETE | `/api/productos/{id}` | ADMIN | Eliminar |

### Pedidos
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/pedidos` | ADMIN/EMPLEADO | Todos los pedidos |
| GET | `/api/pedidos/usuario/{id}` | CLIENTE | Mis pedidos |
| GET | `/api/pedidos/estado/{estado}` | ADMIN/EMPLEADO | Filtrar por estado |
| POST | `/api/pedidos` | CLIENTE | Crear pedido |
| PATCH | `/api/pedidos/{id}/estado` | ADMIN/EMPLEADO | Cambiar estado |

### Estados de un pedido
```
PENDIENTE → CONFIRMADO → ENVIADO → LISTO PARA ENTREGAR
```

---

##  Equipo de Desarrollo

| Nombre |
|---|
| Juan Pablo Ballesteros Macías
| Neiber Hernando Zipasuca Soto
| Diego Barragan

**Universidad Industrial de Santander — Bucaramanga, Colombia**