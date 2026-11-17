import { Router } from "express";

import {
  crearCategoria,
  listarCategorias,
  buscarCategoriaPorID,
  borrarCategoriaPorID,
  editarCategoriaPorID,
  listarTodasLasCategorias,
} from "../controllers/categorias.controllers.js";

import {
  validacionCategoria,
  validacionIDCategoria,
  validacionPatchCategoria,
  validacionPaginacion,
} from "../middlewares/validacionCategoria.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/rolMiddleware.js";

const router = Router();

router
  .route("/")
  .get(validacionPaginacion,listarCategorias)
  .post(
    verificarToken,
    verificarRol("admin"),
    validacionCategoria,
    crearCategoria,
  );

  router.get("/todas", listarTodasLasCategorias);

router
  .route("/:id")
  .get(validacionIDCategoria, buscarCategoriaPorID)
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
