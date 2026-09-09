import { body, param } from "express-validator";
import { resultadoValidacion } from "./resultadoValidacion.js";

export const validacionCancha = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre de la cancha es obligatorio")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres")
    .trim(),

  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 5, max: 200 })
    .withMessage("La descripción debe tener entre 5 y 200 caracteres")
    .trim(),

  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("imagen")
    .notEmpty()
    .withMessage("La imagen es obligatoria")
    .isURL()
    .withMessage("La imagen debe ser una URL válida"),

  body("tipo")
    .notEmpty()
    .withMessage("El tipo de cancha es obligatorio")
    .isIn(["Fútbol 5", "Fútbol 7", "Fútbol 11"])
    .withMessage("El tipo debe ser Fútbol 5, Fútbol 7 o Fútbol 11"),

  body("disponible")
    .optional()
    .isBoolean()
    .withMessage("El campo disponible debe ser verdadero o falso"),

  resultadoValidacion,
];

export const validacionIDCancha = [
  param("id").isMongoId().withMessage("El ID de la cancha no es válido"),

  resultadoValidacion,
];

export const validacionPatchCancha = [
  body("nombre")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres")
    .trim(),

  body("descripcion")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("La descripción debe tener entre 5 y 200 caracteres")
    .trim(),

  body("precio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("imagen")
    .optional()
    .isURL()
    .withMessage("La imagen debe ser una URL válida"),

  body("tipo")
    .optional()
    .isIn(["Fútbol 5", "Fútbol 7", "Fútbol 11"])
    .withMessage("El tipo debe ser Fútbol 5, Fútbol 7 o Fútbol 11"),

  body("disponible")
    .optional()
    .isBoolean()
    .withMessage("El campo disponible debe ser verdadero o falso"),

  resultadoValidacion,
];
