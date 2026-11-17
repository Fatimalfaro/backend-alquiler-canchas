const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || err.statusCode || 500;
  let mensaje = "Error interno del servidor";

  // Error al interpretar JSON enviado por el cliente.
if (err.type === "entity.parse.failed") {
  status = 400;
  mensaje = "Los datos enviados tienen un formato incorrecto.";
}

  // Error de validación de Mongoose.
  if (err.name === "ValidationError") {
    status = 400;
    mensaje = "Los datos enviados no son válidos";
  }

  // ID de MongoDB inválido.
  else if (err.name === "CastError") {
    status = 400;
    mensaje = "El identificador enviado no es válido";
  }

  // Dato duplicado.
  else if (err.code === 11000 && !err.status && !err.statusCode) {
    status = 409;
    mensaje = "Ya existe un registro con esos datos";
  }

  // Errores HTTP controlados.
  else if (status >= 400 && status < 500) {
    mensaje = err.message || "La solicitud no pudo procesarse";
  }

  // Para errores 4xx, conservar las respuestas
  // personalizadas preparadas por los servicios.
  if (
    status >= 400 &&
    status < 500 &&
    err.payload &&
    typeof err.payload === "object"
  ) {
    return res.status(status).json(err.payload);
  }

  return res.status(status).json({
    mensaje,
  });
};

export default errorHandler;
