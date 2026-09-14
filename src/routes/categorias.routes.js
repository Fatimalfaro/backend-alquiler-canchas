import { Router } from "express";

import {
  crearCategoria,
  listarCategorias,
  buscarCategoriaPorID,
  borrarCategoriaPorID,
  editarCategoriaPorID,
} from "../controllers/categorias.controllers.js";

import {
  validacionCategoria,
  validacionIDCategoria,
  validacionPatchCategoria,
} from "../middlewares/validacionCategoria.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/rolMiddleware.js";

const router = Router();

router
  .route("/")
  .get(listarCategorias)
  .post(
    verificarToken,
    verificarRol("admin"),
    validacionCategoria,
    crearCategoria,
  );

router
  .route("/:id")
  .get(
    verificarToken,
    validacionIDCategoria,
    buscarCategoriaPorID,
  )
  .delete(
    verificarToken,
    verificarRol("admin"),
    validacionIDCategoria,
    borrarCategoriaPorID,
  )
  .put(
    verificarToken,
    verificarRol("admin"),
    validacionIDCategoria,
    validacionCategoria,
    editarCategoriaPorID,
  )
  .patch(
    verificarToken,
    verificarRol("admin"),
    validacionIDCategoria,
    validacionPatchCategoria,
    editarCategoriaPorID,
  );

export default router;