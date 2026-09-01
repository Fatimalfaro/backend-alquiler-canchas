import {body} from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

export const validacionProducto = [
    body("nombreProducto")
        .notEmpty().withMessage("El nombre del producto es un dato obligatorio")
        .isString().withMessage("El nombre del producto debe ser un texto")
        .isLength({min: 3, max: 50}).withMessage("El nombre del producto debe tener entre 3 y 50 caracteres"),
        
    body("precio")
        .notEmpty().withMessage("El precio es un dato obligatorio")
        .isNumeric().withMessage("El precio debe ser en formato numérico"),

    body("descripcion")
        .notEmpty().withMessage("La descripción es un dato obligatorio")
        .isString().withMessage("La descripción debe ser un texto")
        .isLength({min: 5, max: 100}).withMessage("La descripción debe tener entre 5 y 100 caracteres"),

        resultadoValidacion
]