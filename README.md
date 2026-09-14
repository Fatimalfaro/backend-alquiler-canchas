#  Backend - Alquiler de Canchas

Backend de una aplicación web para la **reserva de canchas de fútbol**, gestión de productos, carrito de compras y pagos online mediante Mercado Pago.

El proyecto fue desarrollado como trabajo grupal.

## 👥 Integrantes

* **Almaraz Abel**
* **Fátima Alfaro**
* **Ángel Nader**

---

#  Funcionalidades principales

### 👤 Usuarios

* Registro de usuarios.
* Verificación de correo electrónico mediante código.
* Reenvío de código de verificación.
* Inicio y cierre de sesión.
* Autenticación mediante JWT.
* JWT almacenado en cookie `httpOnly`.
* Gestión de perfiles.
* Gestión de usuarios por parte del administrador.
* Activación y desactivación de usuarios.
* Gestión de roles.
* Protección del administrador principal.

### ⚽ Canchas

* Crear canchas.
* Listar canchas.
* Buscar cancha por ID.
* Editar canchas.
* Eliminar canchas.
* Paginación.
* Búsqueda por nombre.
* Carga de imágenes mediante Cloudinary.
* Control de disponibilidad.
* Tipos de cancha:

  * Fútbol 5
  * Fútbol 7
  * Fútbol 11

### 📅 Reservas

* Crear reservas.
* Listar reservas.
* Buscar reservas por ID.
* Editar reservas.
* Cancelar reservas.
* Consultar disponibilidad.
* Control de reservas duplicadas.
* Control de fechas pasadas.
* Horarios desde las 08:00 hasta las 23:00.
* Duración de una hora por reserva.
* Confirmación de reserva mediante Mercado Pago.

### 🛍️ Productos

* Crear productos.
* Listar productos.
* Buscar productos por ID.
* Editar productos.
* Eliminar productos.
* Paginación.
* Búsqueda por nombre.
* Gestión de categorías.
* Carga de imágenes mediante Cloudinary.
* Imagen predeterminada cuando no se proporciona una imagen.

### 🛒 Carrito

* Agregar productos.
* Aumentar cantidad.
* Disminuir cantidad.
* Eliminar productos.
* Vaciar carrito.
* Consultar carrito.
* Un carrito por usuario.
* Los administradores no pueden agregar productos al carrito.

### 💳 Pagos

* Integración con Mercado Pago.
* Creación de preferencias de pago para productos.
* Creación de preferencias de pago para reservas.
* Webhook de Mercado Pago.
* Confirmación automática de pagos aprobados.
* Creación de órdenes.
* Asociación de pagos con órdenes y reservas.
* Consulta de compras realizadas.

---

# 🛠️ Tecnologías utilizadas

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JavaScript / ES Modules**
* **JWT**
* **bcrypt**
* **express-validator**
* **Multer**
* **Cloudinary**
* **Mercado Pago**
* **Nodemailer**
* **Mailtrap**
* **dotenv**
* **CORS**
* **ngrok**

---

# 📁 Estructura del proyecto

```text
backend-alquiler-canchas/
│
├── src/
│   │
│   ├── controllers/
│   │   ├── carrito.controllers.js
│   │   ├── canchas.controllers.js
│   │   ├── categorias.controllers.js
│   │   ├── pago.controllers.js
│   │   ├── productos.controllers.js
│   │   ├── reservas.controllers.js
│   │   └── usuario.controllers.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── rolMiddleware.js
│   │   ├── upload.js
│   │   ├── errorMulter.js
│   │   └── validaciones/
│   │
│   ├── models/
│   │   ├── carrito.js
│   │   ├── cancha.js
│   │   ├── categoria.js
│   │   ├── orden.js
│   │   ├── producto.js
│   │   ├── reserva.js
│   │   └── usuario.js
│   │
│   ├── routes/
│   │   ├── carrito.routes.js
│   │   ├── canchas.routes.js
│   │   ├── categorias.routes.js
│   │   ├── index.routes.js
│   │   ├── pago.routes.js
│   │   ├── productos.routes.js
│   │   ├── reservas.routes.js
│   │   └── usuario.routes.js
│   │
│   └── utils/
│       ├── buscarOcrearCarrito.js
│       ├── cloudinary.js
│       ├── subirImagenACloudinary.js
│       └── enviarCodigoVerificacion.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 🔐 Autenticación y autorización

La autenticación se realiza mediante **JWT almacenado en una cookie HTTP-only**.

El JWT contiene:

```json
{
  "id": "ID_DEL_USUARIO",
  "rol": "usuario"
}
```

La cookie utilizada es:

```text
token
```

El token tiene una duración de:

```text
1 hora
```

## Roles

El sistema cuenta con dos roles:

```text
usuario
admin
```

Las rutas administrativas utilizan el middleware:

```js
verificarToken
verificarRol("admin")
```

Esto permite proteger las operaciones que solamente pueden realizar los administradores.

---

# 👤 Usuarios

## Registrar usuario

```http
POST /api/usuario/registro
```

Ejemplo:

```json
{
  "nombre": "José",
  "apellido": "Pérez",
  "email": "jose@example.com",
  "password": "12345678"
}
```

Al registrarse, el usuario queda inicialmente como:

```json
{
  "rol": "usuario",
  "activo": true,
  "emailVerificado": false
}
```

La contraseña se almacena utilizando `bcrypt`.

---

## Verificar email

```http
POST /api/usuario/verificar-email
```

Ejemplo:

```json
{
  "email": "jose@example.com",
  "codigo": "123456"
}
```

El código:

* Tiene 6 dígitos.
* Tiene una duración de 10 minutos.
* Se elimina una vez utilizado correctamente.

---

## Reenviar código

```http
POST /api/usuario/reenviar-codigo
```

El sistema permite solicitar un nuevo código cada 60 segundos.

Si se solicita antes de tiempo, devuelve:

```http
429 Too Many Requests
```

---

## Iniciar sesión

```http
POST /api/usuario/login
```

Ejemplo:

```json
{
  "email": "jose@example.com",
  "password": "12345678"
}
```

Para iniciar sesión correctamente:

1. El usuario debe existir.
2. Debe estar activo.
3. La contraseña debe ser correcta.
4. El email debe estar verificado.

---

## Obtener usuario actual

```http
GET /api/usuario/me
```

🔒 Requiere autenticación.

Devuelve los datos del usuario autenticado sin incluir la contraseña.

---

## Cerrar sesión

```http
POST /api/usuario/logout
```

Elimina la cookie de autenticación.

---

## Listar usuarios

```http
GET /api/usuario
```

🔒 Requiere:

```text
Token + rol admin
```

El administrador principal configurado en `ADMIN_PRINCIPAL_ID` no se incluye en el listado.

---

## Obtener usuario por ID

```http
GET /api/usuario/:id
```

🔒 Requiere autenticación.

* Usuario común → solamente puede consultar su propio usuario.
* Administrador → puede consultar cualquier usuario.

---

## Actualizar usuario

```http
PUT /api/usuario/:id
```

🔒 Requiere autenticación.

El usuario puede modificar sus propios datos.

El administrador puede modificar usuarios y también:

```text
rol
activo
```

Si se modifica el email, se genera un nuevo código de verificación.

---

## Eliminar usuario

```http
DELETE /api/usuario/:id
```

🔒 Requiere:

```text
Token + rol admin
```

El administrador principal no puede ser eliminado.

---

# ⚽ Canchas

## Listar canchas

```http
GET /api/canchas
```

Permite realizar búsquedas y utilizar paginación.

Parámetros:

```text
termino
pagina
limite
```

Ejemplo:

```http
GET /api/canchas?termino=futbol&pagina=1&limite=8
```

La paginación utiliza:

```text
pagina = 1
limite = 8
```

por defecto.

Respuesta:

```json
{
  "canchas": [],
  "cantidadCanchas": 10,
  "pagina": 1,
  "limite": 8
}
```

---

## Crear cancha

```http
POST /api/canchas
```

🔒 Requiere:

```text
Token + rol admin
```

Utiliza `multipart/form-data`.

Campos:

```text
nombre
descripcion
precio
tipo
disponible
imagen
```

Tipos permitidos:

```text
Fútbol 5
Fútbol 7
Fútbol 11
```

La imagen se almacena en Cloudinary.

---

## Buscar cancha por ID

```http
GET /api/canchas/:id
```

🔒 Requiere autenticación.

---

## Editar cancha

```http
PUT /api/canchas/:id
```

🔒 Requiere:

```text
Token + rol admin
```

También se dispone de:

```http
PATCH /api/canchas/:id
```

---

## Eliminar cancha

```http
DELETE /api/canchas/:id
```

🔒 Requiere:

```text
Token + rol admin
```

---

# 📅 Reservas

## Crear reserva

```http
POST /api/reservas
```

🔒 Requiere autenticación.

Ejemplo:

```json
{
  "cancha": "ID_DE_LA_CANCHA",
  "fecha": "2026-09-20",
  "horaInicio": "18:00"
}
```

El backend calcula automáticamente la hora de finalización:

```text
18:00 → 19:00
```

No se permite:

* Reservar una cancha inexistente.
* Reservar una cancha no disponible.
* Reservar fechas pasadas.
* Realizar reservas duplicadas.
* Que un administrador realice una reserva.

---

## Listar reservas

```http
GET /api/reservas
```

🔒 Requiere autenticación.

### Usuario común

Recibe solamente sus reservas.

### Administrador

Puede consultar todas las reservas.

---

## Buscar reserva

```http
GET /api/reservas/:id
```

🔒 Requiere autenticación.

Un usuario común solamente puede consultar sus propias reservas.

---

## Consultar disponibilidad

```http
GET /api/reservas/disponibilidad/:cancha/:fecha
```

🔒 Requiere autenticación.

Los horarios se generan desde:

```text
08:00
09:00
10:00
11:00
12:00
...
23:00
```

Cada turno devuelve:

```json
{
  "horaInicio": "18:00",
  "horaFin": "19:00",
  "disponible": true
}
```

---

## Editar reserva

```http
PATCH /api/reservas/:id
```

🔒 Requiere autenticación.

Permite modificar:

```text
cancha
fecha
horaInicio
```

El administrador también puede modificar el estado.

Estados disponibles:

```text
pendiente
confirmada
cancelada
```

---

## Cancelar reserva

```http
DELETE /api/reservas/:id
```

🔒 Requiere autenticación.

La reserva no se elimina físicamente de MongoDB.

Se modifica su estado:

```json
{
  "estado": "cancelada"
}
```

---

# 🛍️ Productos

## Listar productos

```http
GET /api/producto
```

Permite búsqueda y paginación.

Parámetros:

```text
termino
pagina
limite
```

Ejemplo:

```http
GET /api/producto?termino=botin&pagina=1&limite=6
```

---

## Crear producto

```http
POST /api/producto
```

🔒 Requiere:

```text
Token + rol admin
```

Utiliza `multipart/form-data`.

Campos:

```text
nombreProducto
descripcion
precio
categoria
imagen
```

La imagen se almacena en Cloudinary.

Si no se proporciona una imagen, se utiliza una imagen predeterminada.

---

## Buscar producto por ID

```http
GET /api/producto/:id
```

Esta ruta es pública.

---

## Editar producto

```http
PUT /api/producto/:id
```

🔒 Requiere:

```text
Token + rol admin
```

También:

```http
PATCH /api/producto/:id
```

---

## Eliminar producto

```http
DELETE /api/producto/:id
```

🔒 Requiere:

```text
Token + rol admin
```

---

# 🗂️ Categorías

## Crear categoría

```http
POST /api/categorias
```

Ejemplo:

```json
{
  "nombreCategoria": "Indumentaria deportiva"
}
```

## Listar categorías

```http
GET /api/categorias
```

## Buscar categoría

```http
GET /api/categorias/:id
```

## Editar categoría

```http
PUT /api/categorias/:id
```

También:

```http
PATCH /api/categorias/:id
```

## Eliminar categoría

```http
DELETE /api/categorias/:id
```

> Actualmente las rutas de categorías no tienen middleware de autenticación ni de rol administrador.

---

# 🛒 Carrito

Todas las operaciones del carrito requieren autenticación.

## Agregar producto

```http
POST /api/carrito
```

Ejemplo:

```json
{
  "producto": "ID_DEL_PRODUCTO",
  "cantidad": 2
}
```

Si el producto ya existe en el carrito, se incrementa la cantidad.

---

## Obtener carrito

```http
GET /api/carrito
```

Devuelve el carrito correspondiente al usuario autenticado.

---

## Vaciar carrito

```http
DELETE /api/carrito
```

---

## Restar cantidad

```http
PATCH /api/carrito/restar/:productoId
```

Disminuye una unidad.

Cuando la cantidad llega a cero, el producto se elimina del carrito.

---

## Eliminar producto

```http
DELETE /api/carrito/producto/:productoId
```

Elimina completamente el producto del carrito.

---

# 💳 Mercado Pago

El backend utiliza Mercado Pago para procesar los pagos de productos y reservas.

## Crear preferencia para productos

```http
POST /api/pago/crear-preferencia
```

🔒 Requiere autenticación.

El backend:

1. Obtiene el carrito del usuario.
2. Verifica que tenga productos.
3. Calcula el total.
4. Crea una orden.
5. Crea la preferencia de Mercado Pago.
6. Guarda el `preferenceId`.
7. Devuelve la URL de pago.

La orden comienza con:

```text
estado: pendiente
```

La moneda utilizada es:

```text
ARS
```

---

## Crear preferencia para una reserva

```http
POST /api/pago/crear-preferencia-reserva
```

🔒 Requiere autenticación.

Ejemplo:

```json
{
  "reservaId": "ID_DE_LA_RESERVA"
}
```

La reserva debe:

* Existir.
* Pertenecer al usuario autenticado.
* Encontrarse en estado `pendiente`.

---

# 🔔 Webhook de Mercado Pago

```http
GET /api/pago/webhook
POST /api/pago/webhook
```

Esta ruta es pública porque Mercado Pago necesita poder acceder a ella.

El webhook recibe las notificaciones de Mercado Pago y consulta el estado real del pago.

Cuando el pago es aprobado:

### Compra de productos

La orden pasa de:

```text
pendiente
```

a:

```text
aprobada
```

Además:

* Se guarda el `paymentId`.
* Se vacía el carrito del usuario.

### Reserva

La reserva pasa de:

```text
pendiente
```

a:

```text
confirmada
```

---

# 🧾 Mis compras

```http
GET /api/pago/mis-compras
```

🔒 Requiere autenticación.

Devuelve las órdenes correspondientes al usuario autenticado.

Las órdenes se muestran desde la más reciente hasta la más antigua.

---

# ☁️ Cloudinary

Cloudinary se utiliza para almacenar las imágenes de:

* Canchas.
* Productos.

Configuración:

```env
CLOUDINARY_CLOUD_NAME=TU_CLOUD_NAME
CLOUDINARY_API_KEY=TU_API_KEY
CLOUDINARY_API_SECRET=TU_API_SECRET
```

Las imágenes se reciben mediante Multer y posteriormente se suben a Cloudinary.

Para las imágenes de las canchas se utiliza la carpeta:

```text
imagenes-cancha
```

Cloudinary devuelve una URL segura (`secure_url`) que se almacena en MongoDB.

---

# 📧 Verificación de correo

El proyecto utiliza **Nodemailer + Mailtrap** para realizar las pruebas de envío de correos.

El flujo es:

```text
Registro
   ↓
Generación de código
   ↓
Envío de correo
   ↓
Usuario ingresa código
   ↓
Validación
   ↓
Email verificado
```

El código tiene:

```text
6 dígitos
10 minutos de validez
60 segundos entre reenvíos
```

---

# 📬 Mailtrap

Mailtrap se utiliza como servicio SMTP durante el desarrollo para probar el envío de los correos electrónicos.

Variables utilizadas:

```env
MAILTRAP_HOST=TU_HOST
MAILTRAP_PORT=TU_PORT
MAILTRAP_USER=TU_USUARIO
MAILTRAP_PASS=TU_PASSWORD
```

Nodemailer utiliza estas variables para establecer la conexión SMTP.

---

# 🌐 Ngrok

Durante el desarrollo se utilizó **ngrok** para exponer temporalmente el servidor local a Internet.

Esto fue especialmente necesario para realizar pruebas con el webhook de Mercado Pago.

Flujo:

```text
Servidor local
http://localhost:3003
        ↓
      ngrok
        ↓
URL pública HTTPS
        ↓
Mercado Pago
        ↓
/api/pago/webhook
```

La URL generada por ngrok puede cambiar al reiniciar el túnel dependiendo de la configuración utilizada.

---

# 🧰 Utilidades

## buscarOcrearCarrito

La utilidad:

```js
buscarOcrearCarrito(usuarioId)
```

busca el carrito correspondiente al usuario.

Si el usuario todavía no tiene uno, crea automáticamente un carrito vacío.

Ejemplo conceptual:

```js
let carrito = await Carrito.findOne({
  usuario: usuarioId
});

if (!carrito) {
  carrito = await Carrito.create({
    usuario: usuarioId,
    items: []
  });
}
```

---

# 🗄️ Modelos de MongoDB

## Usuario

```js
{
  nombre: String,
  apellido: String,
  email: String,
  password: String,
  rol: String,
  activo: Boolean,
  emailVerificado: Boolean,
  codigoVerificacion: String,
  codigoVerificacionExpira: Date,
  ultimoCodigoEnviado: Date
}
```

Roles:

```text
usuario
admin
```

---

## Cancha

```js
{
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen: String,
  tipo: String,
  disponible: Boolean
}
```

Tipos:

```text
Fútbol 5
Fútbol 7
Fútbol 11
```

---

## Producto

```js
{
  nombreProducto: String,
  descripcion: String,
  precio: Number,
  imagen: String,
  categoria: ObjectId
}
```

La categoría tiene una relación con el modelo:

```text
categoria
```

---

## Categoría

```js
{
  nombreCategoria: String
}
```

---

## Carrito

```js
{
  usuario: ObjectId,
  items: [
    {
      producto: ObjectId,
      cantidad: Number
    }
  ]
}
```

Cada usuario posee un único carrito.

---

## Reserva

```js
{
  usuario: ObjectId,
  cancha: ObjectId,
  fecha: Date,
  horaInicio: String,
  horaFin: String,
  precio: Number,
  estado: String
}
```

Estados:

```text
pendiente
confirmada
cancelada
```

---

## Orden

```js
{
  usuario: ObjectId,
  items: [
    {
      producto: ObjectId,
      nombreProducto: String,
      precioUnitario: Number,
      cantidad: Number
    }
  ],
  montoTotal: Number,
  estado: String,
  preferenceId: String,
  paymentId: String
}
```

Estados:

```text
pendiente
aprobada
rechazada
cancelada
```

---

# 🔗 Relaciones entre modelos

Las principales relaciones son:

```text
Usuario
   │
   ├──────── Carrito
   │
   ├──────── Reserva ──────── Cancha
   │
   └──────── Orden ────────── Producto
                                │
                                └── Categoría
```

En MongoDB estas relaciones se realizan mediante `ObjectId` y referencias de Mongoose.

---

# 🔑 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

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

MAILTRAP_HOST=TU_HOST
MAILTRAP_PORT=TU_PORT
MAILTRAP_USER=TU_USUARIO
MAILTRAP_PASS=TU_PASSWORD
```

> ⚠️ Los valores mostrados son ejemplos. No subir credenciales reales al repositorio.

---

# ▶️ Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd backend-alquiler-canchas
```

Instalar las dependencias:

```bash
pnpm install
```

Crear el archivo:

```text
.env
```

Configurar las variables de entorno.

Luego ejecutar el proyecto utilizando el script correspondiente definido en `package.json`.

---

# 🌐 URL base

En desarrollo:

```text
http://localhost:3003/api
```

Por ejemplo:

```text
http://localhost:3003/api/canchas
```

---

# 🔒 Usuarios de prueba

> Estas credenciales son utilizadas para realizar pruebas durante el desarrollo. No utilizar estas cuentas para información real.

### Administrador

```text
Email: admin@example.com
Password: 12345678
Rol: admin
```

### Usuario común

```text
Email: jose207@gmail.com
Password: 12345678
Rol: usuario
```

---

# 🔄 Flujo de autenticación

```text
Registro
   ↓
Código de verificación
   ↓
Verificación del email
   ↓
Inicio de sesión
   ↓
JWT
   ↓
Cookie HTTP-only
   ↓
Acceso a rutas protegidas
```

---

# 🔄 Flujo de reserva

```text
Usuario
   ↓
Selecciona cancha
   ↓
Selecciona fecha
   ↓
Consulta disponibilidad
   ↓
Selecciona horario
   ↓
Backend verifica disponibilidad
   ↓
Crea reserva pendiente
   ↓
Mercado Pago
   ↓
Pago aprobado
   ↓
Webhook
   ↓
Reserva confirmada
```

---

# 🔄 Flujo de compra

```text
Usuario
   ↓
Agrega productos
   ↓
Carrito
   ↓
Crear preferencia de Mercado Pago
   ↓
Orden pendiente
   ↓
Pago
   ↓
Webhook
   ↓
Pago aprobado
   ↓
Orden aprobada
   ↓
Carrito vacío
```

---

# 👨‍💻 Autores

**Almaraz Abel**
**Fátima Alfaro**
**Ángel Nader**

Proyecto desarrollado como trabajo grupal para la formación en desarrollo web.
