import {body} from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

export const validacionProducto = [
    body("nombreProducto")
        .notEmpty().withMessage("El nombre del producto es un dato obligatorio")
        .isLength({min: 3, max: 50}).withMessage("El nombre del producto debe tener entre 3 y 50 caracteres")
        .isString().withMessage("El nombre del producto debe ser un texto"),
]