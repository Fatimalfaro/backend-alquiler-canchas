import { Router } from "express";

import {
  agregarCancha,
  listarCanchas,
  buscarCanchaPorID,
  borrarCanchaPorID,
  editarCanchaPorID,
} from "../controllers/canchas.controllers.js";

import {
  validacionCancha,
  validacionIDCancha,
  validacionPatchCancha,
} from "../middlewares/validacionCancha.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/rolMiddleware.js";
import upload from "../middlewares/upload.js";

const router = Router();

router
  .route("/")
  .get(listarCanchas)

  .post(
  verificarToken,
  verificarRol("admin"),
  upload.single("imagen"),
  validacionCancha,
  agregarCancha,
)
router
  .route("/:id")

  .get(verificarToken, validacionIDCancha, buscarCanchaPorID)

  .delete(
    verificarToken,
    verificarRol("admin"),
    validacionIDCancha,
    borrarCanchaPorID,
  )

 .put(
  verificarToken,
  verificarRol("admin"),
  upload.single("imagen"),
  validacionIDCancha,
  validacionCancha,
  editarCanchaPorID,
)

 .patch(
  verificarToken,
  verificarRol("admin"),
  upload.single("imagen"),
  validacionIDCancha,
  validacionPatchCancha,
  editarCanchaPorID,
);

export default router;
