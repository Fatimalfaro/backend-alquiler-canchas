import { body } from "express-validator";
import mongoose from "mongoose";
import resultadoValidacion from "./resultadoValidacion";

export const validarCarrito = [
    body("usuario")
        .notEmpty()
        .withMessage("El usuario es obligatorio")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("El ID del usuario no es válido"),

    body("items")
        .optional()
        .isArray()
        .withMessage("Los items deben ser un arreglo"),

    body("items.*.producto")
        .optional()
        .notEmpty()
        .withMessage("El producto es obligatorio")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("El ID del producto no es válido"),

    body("items.*.cantidad")
        .optional()
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser un número entero mayor o igual a 1"),

        resultadoValidacion
];