import {body, param} from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const reglasProducto = [
    body("nombreProducto")
        .isString().withMessage("El nombre del producto debe ser un texto")
        .isLength({min: 3, max: 50}).withMessage("El nombre del producto debe tener entre 3 y 50 caracteres"),
        
    body("precio")
        .isNumeric().withMessage("El precio debe ser en formato numérico"),

    body("descripcion")
        .isString().withMessage("La descripción debe ser un texto")
        .isLength({min: 5, max: 100}).withMessage("La descripción debe tener entre 5 y 100 caracteres"),

    body("imagen")
        .isString().withMessage("La imagen debe ser un texto")
        .matches(/^https:\/\/.+\.(jpg|jpeg|png|webp|avif|svg)$/).withMessage("La imagen debe ser una URL válida que comience con https:// y termine con una extensión de imagen válida (jpg, jpeg, png, webp, avif, svg)"),
    
    body("categoria")
        .isString().withMessage("La categoría debe ser un texto")
        .isIn(["Indumentaria deportiva", "Calzado", "Accesorios deportivos", "Pelotas", "Bebidas", "Snacks"]).withMessage("La categoría debe ser una de las opciones válidas"),
]

export const validacionProducto = [...reglasProducto.map((regla) => regla.notEmpty().withMessage("Este campo es un datoobligatorio")), resultadoValidacion];

export const validacionIDProducto = [
    param('id').isMongoId().withMessage("El ID enviado no tiene el formato de ID de MongoDB"), resultadoValidacion
]