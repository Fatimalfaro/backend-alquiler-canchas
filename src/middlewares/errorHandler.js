const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || err.statusCode || 500;
  let mensaje = "Error interno del servidor";

if (err.type === "entity.parse.failed") {
  status = 400;
  mensaje = "Los datos enviados tienen un formato incorrecto.";
}

  if (err.name === "ValidationError") {
    status = 400;
    mensaje = "Los datos enviados no son válidos";
  }

  else if (err.name === "CastError") {
    status = 400;
    mensaje = "El identificador enviado no es válido";
  }

  else if (err.code === 11000 && !err.status && !err.statusCode) {
    status = 409;
    mensaje = "Ya existe un registro con esos datos";
  }

  else if (status >= 400 && status < 500) {
    mensaje = err.message || "La solicitud no pudo procesarse";
  }

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
