import { body, param ,query} from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const reglasProducto = [
  body("nombreProducto")
    .isString()
    .withMessage("El nombre del producto debe ser un texto")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre del producto debe tener entre 3 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/)
    .withMessage(
      "El nombre del producto solo puede contener letras y espacios",
    ),

  body("precio")
    .isNumeric()
    .withMessage("El precio debe ser en formato numérico")
    .custom((precio) => {
      if (Number(precio) < 0) {
        throw new Error("El precio no puede ser negativo");
      }

      return true;
    }),

  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser un texto")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("La descripción debe tener entre 5 y 500 caracteres"),

  body("categoria")
    .isString()
    .withMessage("La categoría debe ser un texto")
    .trim()
    .isMongoId()
    .withMessage("La categoría debe ser un ID de MongoDB válido"),
];

export const validacionProducto = [
  ...reglasProducto.map((regla) =>
    regla.notEmpty().withMessage("Este campo es un datoobligatorio"),
  ),
  resultadoValidacion,
];

export const validacionPatchProducto = [
  ...reglasProducto.map((regla) => regla.optional({ values: "falsy" })),
  resultadoValidacion,
];

export const validacionIDProducto = [
  param("id")
    .isMongoId()
    .withMessage("El ID enviado no tiene el formato de ID de MongoDB"),
  resultadoValidacion,
];
export const validacionPaginacion = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor o igual a 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un entero entre 1 y 100"),
  resultadoValidacion,
];