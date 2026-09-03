import { body, param } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

export const validacionCategoria = [
    body("nombreCategoria")
        .notEmpty()
        .withMessage("El nombre de la categoría es un dato obligatorio")
        .isString()
        .withMessage("El nombre de la categoría debe ser un texto")
        .isLength({ min: 5, max: 100 })
        .withMessage("El nombre de la categoría debe tener entre 5 y 100 caracteres"),

    resultadoValidacion
];

export const validacionIDCategoria = [
    param("id")
        .isMongoId()
        .withMessage("El ID enviado no tiene el formato de ID de MongoDB")
        .bail()
        .custom(async (id) => {
            const categoriaExiste = await Categoria.findById(id);
            if (!categoriaExiste) {
                throw new Error("La categoria seleccionada no existe");
            }
            return true;
        }),

    resultadoValidacion
];