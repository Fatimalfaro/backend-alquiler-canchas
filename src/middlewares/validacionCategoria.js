import { body, param } from "express-validator";

import { resultadoValidacion } from "./resultadoValidacion.js";

export const validacionCategoria = [
  body("nombreCategoria")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 5, max: 100 })
    .withMessage("El nombre debe tener entre 5 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  resultadoValidacion,
];

export const validacionIDCategoria = [
  param("id")
    .isMongoId()
    .withMessage("El ID de la categoría no es válido"),

  resultadoValidacion,
];

export const validacionPatchCategoria = [
  body("nombreCategoria")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría no puede estar vacío")
    .isLength({ min: 5, max: 100 })
    .withMessage("El nombre debe tener entre 5 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  resultadoValidacion,
];