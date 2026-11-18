import { validationResult } from "express-validator";

export const resultadoValidacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Los datos enviados no son válidos");
    error.statusCode = 400;
    error.payload = {
      success: false,
      errores: errors.array().map(err => ({
        campo: err.path || err.param,
        mensaje: err.msg
      })),
    };
    return next(error);
  }
  next();
};

export default resultadoValidacion;