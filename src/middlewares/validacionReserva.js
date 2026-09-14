import { body, param } from "express-validator";

import { resultadoValidacion } from "./resultadoValidacion.js";

export const validacionReserva = [
  body("cancha")
    .notEmpty()
    .withMessage("La cancha es obligatoria")
    .isMongoId()
    .withMessage("El ID de la cancha no es válido"),

  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isISO8601()
    .withMessage("La fecha no es válida"),

  body("horaInicio")
    .notEmpty()
    .withMessage("El turno es obligatorio")
    .matches(/^([01]\d|2[0-3]):00$/)
    .withMessage("El turno debe ser una hora exacta, por ejemplo 09:00"),

  resultadoValidacion,
];

export const validacionIDReserva = [
  param("id")
    .isMongoId()
    .withMessage("El ID de la reserva no es válido"),

  resultadoValidacion,
];

export const validacionPatchReserva = [
  body("cancha")
    .optional()
    .isMongoId()
    .withMessage("El ID de la cancha no es válido"),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha no es válida"),

  body("horaInicio")
    .optional()
    .matches(/^([01]\d|2[0-3]):00$/)
    .withMessage("El turno debe ser una hora exacta, por ejemplo 09:00"),

  body("estado")
    .optional()
    .isIn(["pendiente", "confirmada", "cancelada"])
    .withMessage("El estado debe ser pendiente, confirmada o cancelada"),

  resultadoValidacion,
];