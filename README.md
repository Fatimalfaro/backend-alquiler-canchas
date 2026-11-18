# Backend - Alquiler de Canchas

API REST para una aplicación web de reservas de canchas de fútbol y venta de productos deportivos. Permite administrar usuarios, canchas, reservas, categorías, productos, carritos y pagos mediante Mercado Pago.

Proyecto desarrollado como trabajo grupal.

## Integrantes

- Almaraz Abel
- Fátima Alfaro
- Ángel Nader

## Funcionalidades principales

### Usuarios y autenticación
- Registro de usuarios y verificación de correo electrónico mediante código.
- Reenvío del código de verificación.
- Inicio y cierre de sesión.
- Autenticación mediante JWT almacenado en una cookie `httpOnly`.
- Consulta y actualización del perfil.
- Administración de usuarios, roles y estado de las cuentas.
- Protección del administrador principal.

### Canchas
- Alta, consulta, edición y eliminación de canchas.
- Búsqueda por nombre y paginación.
- Administración de disponibilidad y tipos de cancha: Fútbol 5, Fútbol 7 y Fútbol 11.
- Carga de imágenes mediante Cloudinary.

### Reservas
- Creación, consulta, modificación y cancelación de reservas.
- Consulta de disponibilidad por cancha y fecha.
- Reservas de una hora, con horarios disponibles entre las 08:00 y las 23:00.
- Validación de fechas pasadas y prevención de reservas duplicadas.
- Restricción de acceso a las reservas según el rol y la propiedad de cada reserva.
- Confirmación de la reserva luego de verificar el pago.

### Productos y categorías
- Alta, consulta, edición y eliminación de productos.
- Búsqueda por nombre y paginación.
- Administración de categorías.
- Carga de imágenes mediante Cloudinary.
- Imagen predeterminada para productos cuando no se proporciona una imagen.

### Carrito
- Un carrito asociado a cada usuario.
- Agregar productos, modificar cantidades, quitar productos y vaciar el carrito.
- Consulta del carrito del usuario autenticado.
- Los administradores no pueden operar como compradores desde el carrito.

### Pagos y órdenes
- Integración con Mercado Pago.
- Creación de preferencias de pago para compras y reservas.
- Recepción de notificaciones mediante webhook.
- Actualización del estado de órdenes y reservas según el resultado del pago.
- Consulta del historial de compras.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB y Mongoose
- JavaScript con ES Modules
- JSON Web Token (JWT)
- bcrypt
- express-validator
- Multer
- Cloudinary
- Mercado Pago
- Nodemailer
- Servicio SMTP para el envío de correos
- dotenv
- CORS

## Estructura del proyecto

```text
backend-alquiler-canchas/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server/
│   ├── services/
│   └── utils/
├── .env
├── .gitignore
├── package.json
└── README.md
```

La estructura muestra las carpetas principales. Dentro de cada una se encuentran los módulos correspondientes a usuarios, canchas, reservas, productos, categorías, carrito y pagos.

## Instalación y ejecución

### Requisitos previos

- Node.js.
- pnpm (o el gestor de paquetes configurado para el proyecto).
- Una instancia de MongoDB.
- Cuentas y credenciales de los servicios externos que se quieran utilizar: Mercado Pago, Cloudinary y el proveedor SMTP.

### Pasos

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Fatimalfaro/backend-alquiler-canchas.git
   ```

2. Ingresar a la carpeta del backend:

   ```bash
   cd backend-alquiler-canchas
   ```

3. Instalar las dependencias:

   ```bash
   pnpm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto y completar las variables de entorno.

5. Consultar los scripts disponibles en `package.json`:

   ```bash
   pnpm run
   ```

6. Ejecutar el script de desarrollo definido en `package.json`. Por ejemplo, si el script se llama `dev`:

   ```bash
   pnpm run dev
   ```

## Variables de entorno

Crear el archivo `.env` en la raíz del proyecto. Completarlo con los valores correspondientes al entorno local o de despliegue.

```env
PORT=3003

MONGODB_URI=TU_URI_DE_MONGODB
JWT_SECRET=TU_SECRETO_JWT

MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_DE_MERCADO_PAGO
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3003

ADMIN_PRINCIPAL_ID=ID_DEL_ADMIN_PRINCIPAL

CLOUDINARY_CLOUD_NAME=TU_CLOUD_NAME
CLOUDINARY_API_KEY=TU_API_KEY
CLOUDINARY_API_SECRET=TU_API_SECRET

MAILTRAP_HOST=TU_HOST_SMTP
MAILTRAP_PORT=TU_PUERTO_SMTP
MAILTRAP_USER=TU_USUARIO_SMTP
MAILTRAP_PASS=TU_PASSWORD_SMTP
```

> Los nombres de las variables deben coincidir con los utilizados por la configuración del proyecto. No subir el archivo `.env` ni credenciales reales al repositorio. En producción, configurar estas variables desde el panel del servicio de hosting.

## URL base y rutas

En desarrollo local, la URL base de la API es:

```text
http://localhost:3003/api
```

Los endpoints que se detallan a continuación se expresan en relación con esa URL base.

## Autenticación y autorización

La autenticación utiliza un JWT guardado en una cookie `httpOnly` llamada `token`. El token incluye el identificador del usuario y su rol, y tiene una duración configurada de una hora.

Roles disponibles:

- `usuario`
- `admin`

Las rutas protegidas requieren autenticación. Las operaciones administrativas requieren, además, el rol `admin`.

### Usuarios

| Método | Endpoint | Acceso |
|---|---|---|
| POST | `/usuario/registro` | Público |
| POST | `/usuario/verificar-email` | Público |
| POST | `/usuario/reenviar-codigo` | Público |
| POST | `/usuario/login` | Público |
| POST | `/usuario/logout` | Público |
| GET | `/usuario/me` | Autenticado |
| GET | `/usuario` | Administrador |
| GET | `/usuario/:id` | Autenticado; propietario o administrador |
| PUT | `/usuario/:id` | Autenticado; propietario o administrador |
| DELETE | `/usuario/:id` | Administrador |

**Registro**

`POST /usuario/registro`

Ejemplo de cuerpo:

```json
{
  "nombre": "José",
  "apellido": "Pérez",
  "email": "jose@example.com",
  "password": "una-clave-de-ejemplo"
}
```

La contraseña se almacena utilizando bcrypt. El usuario debe verificar su correo electrónico antes de iniciar sesión.

**Verificación de correo**

`POST /usuario/verificar-email`

```json
{
  "email": "jose@example.com",
  "codigo": "123456"
}
```

El código tiene seis dígitos, vence a los diez minutos y se elimina luego de utilizarse correctamente. Se permite solicitar otro código respetando el intervalo de reenvío configurado (60 segundos).

**Inicio de sesión**

`POST /usuario/login`

```json
{
  "email": "jose@example.com",
  "password": "una-clave-de-ejemplo"
}
```

Para iniciar sesión, la cuenta debe existir, estar activa, tener el correo verificado y la contraseña debe ser correcta.

`GET /usuario/me` devuelve los datos del usuario autenticado sin incluir la contraseña.

### Canchas

| Método | Endpoint | Acceso |
|---|---|---|
| GET | `/canchas` | Según configuración de la ruta |
| POST | `/canchas` | Administrador |
| GET | `/canchas/:id` | Autenticado |
| PUT | `/canchas/:id` | Administrador |
| PATCH | `/canchas/:id` | Administrador |
| DELETE | `/canchas/:id` | Administrador |

**Listado, búsqueda y paginación**

`GET /canchas`

Parámetros de consulta:

- `termino`: texto para buscar por nombre.
- `pagina`: número de página.
- `limite`: cantidad de elementos por página.

Ejemplo:

```http
GET /api/canchas?termino=futbol&pagina=1&limite=8
```

**Crear cancha**

`POST /canchas`

Requiere `multipart/form-data` y rol administrador. Campos utilizados:

- `nombre`
- `descripcion`
- `precio`
- `tipo`
- `disponible`
- `imagen`

Los tipos de cancha contemplados son `Fútbol 5`, `Fútbol 7` y `Fútbol 11`.

### Reservas

Todas las rutas de reservas requieren autenticación.

| Método | Endpoint | Acceso |
|---|---|---|
| POST | `/reservas` | Usuario |
| GET | `/reservas` | Usuario: propias; administrador: todas |
| GET | `/reservas/disponibilidad/:cancha/:fecha` | Autenticado |
| GET | `/reservas/:id` | Propietario o administrador |
| PATCH | `/reservas/:id` | Propietario o administrador, según campos permitidos |
| DELETE | `/reservas/:id` | Propietario o administrador |

**Crear reserva**

`POST /reservas`

```json
{
  "cancha": "ID_DE_LA_CANCHA",
  "fecha": "AAAA-MM-DD",
  "horaInicio": "18:00"
}
```

El backend calcula la hora de finalización. Cada reserva dura una hora. Se valida que la cancha exista y esté disponible, que la fecha no sea pasada y que el horario no esté ocupado.

**Consultar disponibilidad**

`GET /reservas/disponibilidad/:cancha/:fecha`

Devuelve los horarios y si cada uno está disponible. Los horarios se generan entre las 08:00 y las 23:00.

**Modificar reserva**

`PATCH /reservas/:id`

El usuario puede modificar los datos de su reserva dentro de los campos permitidos. El administrador también puede modificar el estado. Los estados contemplados son:

- `pendiente`
- `confirmada`
- `cancelada`

**Cancelar reserva**

`DELETE /reservas/:id`

La cancelación es lógica: la reserva permanece en MongoDB y cambia su estado a `cancelada`.

### Productos

| Método | Endpoint | Acceso |
|---|---|---|
| GET | `/producto` | Según configuración de la ruta |
| POST | `/producto` | Administrador |
| GET | `/producto/:id` | Público |
| PUT | `/producto/:id` | Administrador |
| PATCH | `/producto/:id` | Administrador |
| DELETE | `/producto/:id` | Administrador |

**Listado, búsqueda y paginación**

`GET /producto`

Parámetros:

- `termino`
- `pagina`
- `limite`

Ejemplo:

```http
GET /api/producto?termino=botin&pagina=1&limite=6
```

**Crear producto**

`POST /producto`

Requiere `multipart/form-data` y rol administrador. Campos:

- `nombreProducto`
- `descripcion`
- `precio`
- `categoria`
- `imagen`

La imagen se almacena en Cloudinary. Si no se envía una imagen, se utiliza una imagen predeterminada.

### Categorías

Las consultas de categorías son públicas. Las operaciones de escritura requieren permisos de administrador.

| Método | Endpoint | Acceso |
|---|---|---|
| GET | `/categorias` | Público |
| GET | `/categorias/:id` | Público |
| POST | `/categorias` | Administrador |
| PUT | `/categorias/:id` | Administrador |
| PATCH | `/categorias/:id` | Administrador |
| DELETE | `/categorias/:id` | Administrador |

Ejemplo para crear una categoría:

```json
{
  "nombreCategoria": "Indumentaria deportiva"
}
```

### Carrito

Todas las operaciones del carrito requieren autenticación. Cada usuario opera sobre su propio carrito.

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/carrito` | Agrega un producto |
| GET | `/carrito` | Obtiene el carrito |
| DELETE | `/carrito` | Vacía el carrito |
| PATCH | `/carrito/restar/:productoId` | Disminuye una unidad |
| DELETE | `/carrito/producto/:productoId` | Elimina un producto |

Ejemplo para agregar un producto:

```json
{
  "producto": "ID_DEL_PRODUCTO",
  "cantidad": 2
}
```

Si el producto ya está en el carrito, se incrementa su cantidad. Al disminuir la cantidad hasta cero, el producto se quita del carrito.

### Pagos con Mercado Pago

El backend permite generar preferencias de pago para compras de productos y reservas. Las operaciones requieren autenticación.

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/pago/crear-preferencia` | Crea una preferencia para los productos del carrito |
| POST | `/pago/crear-preferencia-reserva` | Crea una preferencia para una reserva |
| GET/POST | `/pago/webhook` | Recibe notificaciones de Mercado Pago |
| GET | `/pago/mis-compras` | Consulta las compras del usuario autenticado |

**Preferencia para productos**

`POST /pago/crear-preferencia`

El backend obtiene el carrito del usuario, verifica que tenga productos, calcula el total, crea una orden pendiente y genera la preferencia de Mercado Pago. La moneda utilizada es ARS.

**Preferencia para una reserva**

`POST /pago/crear-preferencia-reserva`

```json
{
  "reservaId": "ID_DE_LA_RESERVA"
}
```

La reserva debe existir, pertenecer al usuario autenticado y encontrarse pendiente.

**Webhook**

`/pago/webhook`

Mercado Pago envía notificaciones a este endpoint. El backend consulta la información del pago en Mercado Pago y, cuando corresponde, actualiza la orden o reserva asociada. Para una compra aprobada, la orden se marca como aprobada y se vacía el carrito. Para una reserva aprobada, la reserva se marca como confirmada.

El endpoint debe ser accesible desde Internet para que Mercado Pago pueda enviar notificaciones. La URL configurada en `BACKEND_URL` debe corresponder al backend publicado y utilizarse para construir la URL de notificación.

> Para probar la integración, utilizar credenciales y usuarios de prueba de Mercado Pago. No publicar access tokens, datos de tarjetas ni credenciales de prueba en el repositorio. Consultar la documentación oficial de Mercado Pago para obtener tarjetas y datos de prueba vigentes.

**Mis compras**

`GET /pago/mis-compras`

Devuelve las órdenes del usuario autenticado, ordenadas desde la más reciente hasta la más antigua.

## Servicios externos

### Cloudinary

Se utiliza para almacenar las imágenes de canchas y productos. Las imágenes se reciben mediante Multer y se suben a Cloudinary; la URL segura devuelta por el servicio se guarda en MongoDB.

### Correo electrónico

El envío de códigos de verificación se realiza mediante Nodemailer y un servidor SMTP configurado con variables de entorno. Los datos de conexión deben mantenerse fuera del repositorio.

## Modelos principales

El backend utiliza Mongoose para definir los modelos y sus relaciones mediante referencias `ObjectId`.

- **Usuario:** datos personales, email, contraseña cifrada, rol, estado de la cuenta y datos de verificación de correo.
- **Cancha:** nombre, descripción, precio, imagen, tipo y disponibilidad.
- **Reserva:** usuario, cancha, fecha, hora de inicio y finalización, precio y estado. También almacena los identificadores relacionados con la preferencia y el pago cuando corresponde.
- **Producto:** nombre, descripción, precio, imagen y categoría.
- **Categoría:** nombre de la categoría.
- **Carrito:** usuario e ítems con referencia al producto y cantidad.
- **Orden:** usuario, productos comprados, cantidades, importes, estado e identificadores de Mercado Pago.

## Flujos principales

### Flujo de autenticación

```text
Registro
   ↓
Envío del código de verificación
   ↓
Verificación del correo
   ↓
Inicio de sesión
   ↓
JWT en cookie httpOnly
   ↓
Acceso a rutas protegidas
```

### Flujo de reserva

```text
Usuario selecciona cancha, fecha y horario
   ↓
Consulta de disponibilidad
   ↓
Validación de disponibilidad en el backend
   ↓
Creación de reserva pendiente
   ↓
Generación de preferencia de Mercado Pago
   ↓
Pago
   ↓
Notificación mediante webhook
   ↓
Verificación del pago y actualización de la reserva
```

### Flujo de compra

```text
Usuario agrega productos
   ↓
Carrito
   ↓
Creación de preferencia de Mercado Pago
   ↓
Orden pendiente
   ↓
Pago
   ↓
Notificación mediante webhook
   ↓
Verificación del pago
   ↓
Orden aprobada y carrito vacío
```

## Despliegue

El backend puede ejecutarse localmente o desplegarse en un servicio de hosting compatible con Node.js.

Para el entorno publicado:

- Configurar las variables de entorno desde el panel del hosting.
- Utilizar la URI de MongoDB correspondiente al entorno.
- Configurar `FRONTEND_URL` con la URL pública del frontend.
- Configurar `BACKEND_URL` con la URL pública del backend.
- Configurar las credenciales correspondientes al entorno de Mercado Pago.
- Verificar que la URL del webhook sea pública y apunte a `/api/pago/webhook`.

No incluir archivos `.env`, tokens, contraseñas ni credenciales privadas en el repositorio.

## Autores

- Almaraz Abel
- Fátima Alfaro
- Ángel Nader

Proyecto desarrollado como trabajo grupal para la formación en desarrollo web.
