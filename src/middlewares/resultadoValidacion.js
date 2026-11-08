import { validationResult } from "express-validator";

export const resultadoValidacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errores: errors.array().map(err => ({
        campo: err.path || err.param,
        mensaje: err.msg
      }))
    });
  }
  next();
};

export default resultadoValidacion;