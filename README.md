# 🍦 FrostHub — Plataforma de Gestión de Helados

**Universidad Industrial de Santander · Proyecto Entornos de Programación**

| Estudiante | Código |
|---|---|
| Juan Pablo Ballesteros Macías | 2224649 |
| Neiber Hernando Zipasuca Soto | 2214004 |
| Diego Andrés Barragán Ruiz | 2211827 |

**Docente:** Carlos Adolfo Beltrán Castro

---

##  Descripción del Proyecto

FrostHub es una plataforma FullStack para la gestión de pedidos de helados pre-empacados de distintas marcas (Crem Helado, Colombina, entre otras). Centraliza en un solo sitio el catálogo de productos, la gestión de usuarios y el seguimiento de pedidos, permitiendo combinar productos de varias marcas en un mismo pedido.

---

##  Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE                            │
│              React + Vite (puerto 5173)                 │
│   LoginPage  ──►  Dashboard  ──►  UsuariosPage (CRUD)   │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP + JWT (Bearer Token)
                       │  Proxy Vite → /api/*
                       ▼
┌─────────────────────────────────────────────────────────┐
│                     BACKEND                             │
│           Spring Boot 3.4.1 (puerto 8083)               │
│                                                         │
│  AuthController   UsuarioController   PedidoController  │
│       │                  │                  │           │
│  JwtUtil + JwtFilter  (Spring Security)                 │
└──────────────────────┬──────────────────────────────────┘
                       │  MongoDB Java Driver 5.2.1
                       │  SRV Connection (SSL/TLS)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  BASE DE DATOS                          │
│          MongoDB Atlas (us-east-1) · Free Tier          │
│     Cluster MO · Replica Set 3 nodos · v8.0.23          │
│                                                         │
│  Colecciones: usuarios · pedidos · productos · marcas   │
│               detallesPedidos · empleados               │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Datos (Colecciones MongoDB)

### Colección: `usuarios`
```json
{
  "_id": "ObjectId",
  "nombre": "string",
  "email": "string (único)",
  "contrasena": "string (BCrypt hash)",
  "telefono": "string",
  "direccion": "string",
  "rol": "ADMIN | EMPLEADO | CLIENTE"
}
```

### Colección: `pedidos`
```json
{
  "_id": "ObjectId",
  "usuario": { /* subdocumento Usuario */ },
  "fechaPedido": "Date",
  "estado": "PENDIENTE | DESPACHADO",
  "total": "Double",
  "direccionEntrega": "string"
}
```

### Colección: `productos`
```json
{
  "_id": "ObjectId",
  "nombre": "string",
  "descripcion": "string",
  "precio": "Double",
  "stock": "Integer",
  "marca": { /* subdocumento Marca */ }
}
```

### Colección: `marcas`
```json
{
  "_id": "ObjectId",
  "nombre": "string",
  "paisOrigen": "string"
}
```

---

##  Flujo de Autenticación JWT

```
Usuario                 Frontend                  Backend              MongoDB
   │                       │                         │                    │
   │── email + contraseña ─►│                         │                    │
   │                       │── POST /api/auth/login ─►│                    │
   │                       │                         │── findByEmail() ──►│
   │                       │                         │◄── Usuario ────────│
   │                       │                         │                    │
   │                       │                         │ BCrypt.matches()   │
   │                       │                         │ generateToken()    │
   │                       │◄── { token, usuario } ──│                    │
   │                       │                         │                    │
   │                       │ localStorage.setItem()  │                    │
   │◄── Dashboard ─────────│                         │                    │
   │                       │                         │                    │
   │── solicitud CRUD ─────►│                         │                    │
   │                       │── Authorization: Bearer TOKEN ──────────────►│
   │                       │   JwtFilter valida token │                    │
   │                       │◄── respuesta ───────────│                    │
```

---

##  Flujo CRUD de Usuarios

```
Frontend (UsuariosPage)              Backend (UsuarioController)
         │                                      │
         │── GET  /api/usuarios ───────────────►│ findAll()
         │◄── Lista de usuarios ────────────────│
         │                                      │
         │── POST /api/usuarios ───────────────►│ save(usuario)
         │   { nombre, email, contrasena... }   │ verifica email único
         │◄── Usuario creado ──────────────────│
         │                                      │
         │── PUT  /api/usuarios/{id} ──────────►│ findById → actualiza
         │   { campos a actualizar }            │ save()
         │◄── Usuario actualizado ─────────────│
         │                                      │
         │── DELETE /api/usuarios/{id} ────────►│ deleteById()
         │◄── 200 OK ──────────────────────────│
```

---

##  Control de Acceso por Roles

| Endpoint | ADMIN | EMPLEADO | CLIENTE | Público |
|---|:---:|:---:|:---:|:---:|
| `POST /api/auth/login` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/usuarios` (registro) | ✅ | ✅ | ✅ | ✅ |
| `GET /api/usuarios` (listar todos) | ✅ | ❌ | ❌ | ❌ |
| `PUT /api/usuarios/{id}` | ✅ | ✅ | ✅ | ❌ |
| `DELETE /api/usuarios/{id}` | ✅ | ❌ | ❌ | ❌ |
| `GET /api/pedidos/**` | ✅ | ✅ | ✅ | ❌ |
| `GET /api/productos/**` | ✅ | ✅ | ✅ | ❌ |

---

##  Estructura del Proyecto

```
Helader-a-Proyecto-Entornos/
│
├── src/main/java/com/uis/heladeria/
│   ├── HeladeriaApplication.java       ← Arranque + usuario admin inicial
│   ├── controller/
│   │   ├── AuthController.java         ← POST /api/auth/login
│   │   ├── UsuarioController.java      ← CRUD /api/usuarios
│   │   ├── PedidoController.java       ← CRUD /api/pedidos
│   │   ├── ProductoController.java     ← CRUD /api/productos
│   │   ├── MarcaController.java        ← CRUD /api/marcas
│   │   └── DetallePedidoController.java
│   ├── model/
│   │   ├── Usuario.java
│   │   ├── Pedido.java
│   │   ├── Producto.java
│   │   ├── Marca.java
│   │   ├── DetallePedido.java
│   │   └── Empleado.java
│   ├── repository/                     ← Interfaces MongoRepository
│   └── security/
│       ├── JwtUtil.java                ← Genera y valida tokens
│       ├── JwtFilter.java              ← Intercepta cada request
│       └── SecurityConfig.java         ← Reglas de acceso + BCrypt
│
├── src/main/resources/
│   └── application.properties          ← MongoDB URI, puerto, JWT secret
│
└── frontend/
    ├── index.html                      ← Entry point HTML
    ├── vite.config.js                  ← Proxy /api → localhost:8083
    └── src/
        ├── main.jsx                    ← ReactDOM.createRoot
        ├── App.jsx                     ← Rutas: / y /dashboard/*
        ├── api.js                      ← apiFetch + manejo de token JWT
        ├── index.css                   ← Estilos globales + variables CSS
        ├── pages/
        │   ├── LoginPage.jsx           ← Login + Registro de cuenta
        │   └── UsuariosPage.jsx        ← Tabla + Modal CRUD usuarios
        └── hooks/
            └── useToast.jsx            ← Hook para notificaciones toast
```

---

##  Pasos para Ejecutar el Proyecto

### Requisitos previos
- Java 17
- Gradle (incluido con `./gradlew`)
- Node.js 18+ y npm

### 1. Clonar y configurar
```bash
git clone <url-del-repositorio>
cd Helader-a-Proyecto-Entornos
```

### 2. Configurar MongoDB Atlas
Edita `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://admin:TU_CONTRASEÑA@mo.gziuz8l.mongodb.net/heladeria?retryWrites=true&w=majority&appName=MO
spring.data.mongodb.database=heladeria
server.port=8083
jwt.secret=frosthub-heladeria-uis-secret-key-2025
```

### 3. Arrancar el backend
```bash
./gradlew bootRun
```
Al arrancar por primera vez crea automáticamente el usuario administrador:
- **Email:** `admin@heladeria.com`
- **Contraseña:** `1234`

{
  "nombre": "Admin Principal",
  "email": "admin@heladeria.com",
  "contrasena": "$2a$10$Xl0yhvzLIaJjzeGR8di7..uXQOKPWWEPn5e8qSXkRJHYBMSHLBHqS",
  "telefono": "3001234567",
  "direccion": "Bucaramanga",
  "rol": "ADMIN"
}
contrasena 1234 encriptada con 10 rounds

### 4. Arrancar el frontend (nueva terminal)
```bash
cd frontend
npm install
npm run dev
```

### 5. Abrir en el navegador
```
http://localhost:5173
```

---

##  Guía de Pruebas

### Prueba 1 — Login exitoso
1. Ir a `http://localhost:5173`
2. Ingresar email: `admin@heladeria.com` / contraseña: `admin123`
3. Resultado esperado: redirige al Dashboard con bienvenida y rol **ADMIN**
![alt text](image.png)
![alt text](image-1.png)

### Prueba 2 — Registro de nuevo usuario
1. En la pantalla de login, clic en ** Crear cuenta**
2. Llenar todos los campos (nombre, teléfono, dirección, email, contraseña)
3. Resultado esperado: mensaje de éxito y vuelve a la pestaña de login
![alt text](image-2.png)
![alt text](image-3.png)

### Prueba 3 — Listar usuarios (solo ADMIN)
1. Loguearse como ADMIN
2. Ir a ** Usuarios** en el menú
3. Resultado esperado: tabla con todos los usuarios registrados en MongoDB
![alt text](image-4.png)

### Prueba 4 — Crear usuario desde el panel
1. En la página de Usuarios, clic en **＋ Nuevo Usuario**
2. Llenar el formulario en el modal
3. Resultado esperado: toast verde "Usuario creado" y aparece en la tabla
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)

### Prueba 5 — Editar usuario
1. En la tabla, clic en ** Editar** en cualquier fila
2. Modificar nombre o rol
3. Resultado esperado: toast "Usuario actualizado" y cambio reflejado
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)



### Prueba 6 — Eliminar usuario (solo ADMIN)
1. Clic en ** Borrar** en cualquier usuario
2. Confirmar el diálogo
3. Resultado esperado: usuario desaparece de la tabla
![alt text](image-11.png)
![alt text](image-12.png)
![alt text](image-13.png)

### Prueba 7 — Protección de rutas
1. Sin estar logueado, intentar entrar a `http://localhost:5173/dashboard`
2. Resultado esperado: redirige automáticamente a la pantalla de login
![alt text](image-14.png)
![alt text](image-15.png)
---

##  Tecnologías Utilizadas

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React | 18.3.1 |
| Frontend | Vite | 5.3.1 |
| Frontend | React Router DOM | 6.23.1 |
| Backend | Spring Boot | 3.4.1 |
| Backend | Spring Security | 6.x |
| Backend | Spring Data MongoDB | 4.4.1 |
| Backend | jjwt (JWT) | 0.12.6 |
| Backend | Lombok | latest |
| Backend | Springdoc OpenAPI (Swagger) | 2.3.0 |
| Base de datos | MongoDB Atlas | 8.0.23 |
| Build | Gradle | 9.4.1 |
| Lenguaje Backend | Java | 17 |

---

##  Endpoints Disponibles

### Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login → retorna JWT |
| GET | `/api/auth/verificar` | Valida token activo |

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Listar todos (ADMIN) |
| GET | `/api/usuarios/{id}` | Obtener por ID |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar (ADMIN) |

### Documentación Swagger
Disponible en: `http://localhost:8083/swagger-ui/index.html`

---

##  Requerimientos Funcionales Implementados

- ✅ **RF1** Registro de usuarios en la plataforma
- ✅ **RF2** Autenticación y control de acceso con JWT
- ✅ **RF3** Gestión de roles (ADMIN, EMPLEADO, CLIENTE)
- ✅ **RF4** CRUD completo de usuarios desde el frontend
- ✅ **RF5** Protección de rutas por rol en backend (Spring Security)
- ✅ **RF6** Protección de rutas en frontend (ProtectedRoute)
- ✅ **RF7** Conexión a base de datos en la nube (MongoDB Atlas)
- ✅ **RF8** Búsqueda/filtrado de usuarios en tiempo real