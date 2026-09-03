import { Router } from "express";
import { crearCategoria, listarCategorias, buscarCategoriaPorID, borrarCategoriaPorID, editarCategoriaPorID } from "../controllers/categorias.controllers.js";
const router = Router();

router.route('/').post(crearCategoria).get(listarCategorias);
router.route('/:id').get(buscarCategoriaPorID).delete(borrarCategoriaPorID).put(editarCategoriaPorID).patch(editarCategoriaPorID);

export default router;