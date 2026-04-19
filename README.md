# Helader-a-Proyecto-Entornos

**Plataforma de Gestión de Pedidos de Helados**

**Estudiantes**
* Juan Pablo Ballesteros Macías - 2224649
* Neiber Hernando Zipasuca Soto – 2214004
* Diego Andrés Barragán Ruiz - 2211827

**Docente**
Carlos Adolfo Beltrán Castro

**Universidad Industrial de Santander**
Bucaramanga, Santander

## Temática
El proyecto consiste en desarrollar un software enfocado en la gestión de pedidos de productos de helados pre empacados de distintas marcas. A diferencia de una heladería tradicional, el modelo se centra en la distribución de productos ya fabricados por empresas como Crem Helado, Colombina y otras, integrando su oferta en una misma plataforma. La idea es reunir en un solo sitio un catálogo con diferentes presentaciones, desde unidades individuales hasta paquetes familiares, y permitir que el usuario combine productos de varias marcas en un mismo pedido. El sistema estará organizado de manera estructurada para facilitar la consulta del inventario, la selección de productos y la gestión de órdenes, tanto para compras individuales como para pedidos de mayor volumen.

## Justificación y/o Pertinencia de la Temática
En los últimos años, la forma en que las personas compran productos ha cambiado con el crecimiento de los medios digitales. Muchas personas buscan opciones que les permitan consultar disponibilidad, comparar marcas y realizar pedidos desde un mismo sitio. Sin embargo, en el caso de los helados pre envasados, la oferta en línea suele estar dispersa, ya que cada marca o establecimiento maneja su propio medio, lo que obliga al cliente a revisar varias plataformas para completar una compra.

Este proyecto propone centralizar en una única plataforma el catálogo de helados pre empacados de múltiples marcas reconocidas, facilitando la experiencia del usuario y optimizando la gestión de pedidos tanto para compradores individuales como para distribuidores mayoristas.

## Mundo del Problema
Actualmente, la comercialización en línea de helados pre envasados carece de una plataforma unificada que integre el portafolio de distintas marcas. Los usuarios interesados en comparar precios, presentaciones o disponibilidad de productos de marcas como Crem Helado y Colombina se ven obligados a visitar múltiples canales digitales o físicos, lo que genera una experiencia fragmentada e ineficiente. Adicionalmente, quienes realizan pedidos de mayor volumen no cuentan con una herramienta centralizada para gestionar órdenes multimarca de manera ágil. Para atender estas necesidades operativas, el sistema contempla la figura de un Empleado que actúa como intermediario entre la plataforma y los procesos internos de despacho y seguimiento de pedidos.

## Requerimientos Funcionales
- RF1: Registro de usuarios en la plataforma.
- RF2: Autenticación y control de acceso al sistema.
- RF3: Gestión de proveedores y marcas de helados.
- RF4: Administración del catálogo de productos.
- RF5: Búsqueda y filtrado avanzado de helados.
- RF6: Gestión del carrito de compras multimarca.
- RF7: Procesamiento y creación de órdenes de pedido.
- RF8: Gestión operativa de pedidos por parte del Empleado.
- RF9: Control de acceso diferenciado por rol.

## Requerimientos No Funcionales
- La plataforma debe ser intuitiva y fácil de usar para todo tipo de usuarios, incluyendo empleados sin experiencia técnica avanzada.
- La interfaz debe ser responsiva y funcionar correctamente en dispositivos móviles, tabletas y computadoras de escritorio.
- Los datos personales y de pago de los usuarios deben almacenarse de forma segura, cumpliendo estándares de protección de datos.
- El sistema debe garantizar una disponibilidad del 99% del tiempo para no interrumpir el proceso de compra ni la gestión operativa de pedidos.
- El catálogo de productos y el estado de los pedidos deben actualizarse en tiempo real para reflejar cambios de inventario y avance en el despacho.
- Los tiempos de respuesta del sistema no deben superar los 3 segundos en operaciones de búsqueda, filtrado y actualización de estado de pedidos.
- El sistema de control de acceso por rol debe garantizar que ningún empleado pueda ejecutar acciones reservadas al administrador.

## Evidencia de Historias de Usuario

| Identificador de la historia | Rol | Característica / Funcionalidad | Razón / Resultado |
| :-: | :-: | :-: | :-: |
| HU-001 | Como administrador | Necesito autenticar mi acceso con credenciales seguras. | Para proteger la plataforma de accesos no autorizados. |
| HU-002 | Como administrador | Necesito registrar y administrar las marcas de helados. | Para mantener actualizado el catálogo marcas en la plataforma. |
| HU-003 | Como administrador | Necesito agregar, editar o eliminar productos del catálogo. | Para mantener la oferta de helados actualizada y precisa. |
| HU-004 | Como cliente | Quiero registrarme e iniciar sesión en la plataforma. | Para tener un perfil personalizado y acceder a mis pedidos. |
| HU-005 | Como cliente | Quiero buscar y filtrar helados por marca, presentación y precio. | Para encontrar rápidamente los productos que necesito. |
| HU-006 | Como cliente | Quiero agregar productos de diferentes marcas a un carrito de compras. | Para hacer un solo pedido combinando varias marcas. |
| HU-007 | Como cliente | Quiero confirmar y procesar mi orden de pedido. | Para formalizar mi compra y recibir confirmación del pedido. |
| HU-008 | Como empleado | Necesito autenticarme con mis credenciales para acceder al módulo operativo. | Para garantizar que solo personal autorizado gestione los pedidos. |
| HU-009 | Como empleado | Necesito visualizar todos los pedidos activos con su detalle (productos, marcas, cantidades y datos del cliente). | Para conocer qué pedidos debo atender y en qué orden de prioridad. |
| HU-010 | Como empleado | Necesito actualizar el estado de un pedido (pendiente, en preparación, despachado, entregado). | Para reflejar el avance real del proceso de despacho en la plataforma. |
| HU-013 | Como empleado | Necesito consultar el catálogo de productos en modo lectura para verificar disponibilidad. | Para confirmar si un producto solicitado tiene stock antes de preparar el despacho. |

## Herramientas Utilizadas
- **PostgreSQL**: Se utilizó como Sistema de Gestión de Bases de Datos Relacional (RDBMS) para crear las tablas, organizar la estructura persistente de la aplicación y garantizar la integridad de información crítica como usuarios, marcas, productos y pedidos.
- **Spring Boot**: Utilizado como el Framework principal en lenguaje Java para construir rápidamente el Backend de nuestro aplicativo.
- **Swagger (Springdoc)**: Usado como herramienta de documentación interactiva que facilita la exploración y pruebas de nuestra API.
## Diseño de la base de datos
![WhatsApp Image 2026-03-11 at 4 16 17 PM](https://github.com/user-attachments/assets/b1774565-eef8-492f-bfa4-a39290448fca)
