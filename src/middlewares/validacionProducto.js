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

    body("imagen")
        .notEmpty().withMessage("La imagen es un dato obligatorio")
        .isString().withMessage("La imagen debe ser un texto")
        .matches(/^https:\/\/.+\.(jpg|jpeg|png|webp|avif|svg)$/).withMessage("La imagen debe ser una URL válida que comience con https:// y termine con una extensión de imagen válida (jpg, jpeg, png, webp, avif, svg)"),
    
    body("categoria")
        .notEmpty().withMessage("La categoría es un dato obligatorio")
        .isString().withMessage("La categoría debe ser un texto")
        .isIn(["Indumentaria deportiva", "Calzado", "Accesorios deportivos", "Pelotas", "Bebidas", "Snacks"]).withMessage("La categoría debe ser una de las opciones válidas"),
        
        resultadoValidacion
]