import { Router } from "express";
import {
  agregarProducto,
  listarProductos,
  buscarProductoPorID,
  borrarProductoPorID,
  editarProductoPorID,
} from "../controllers/productos.controllers.js";
import {
  validacionProducto,
  validacionIDProducto,
  validacionPatchProducto,
  validacionPaginacion,
} from "../middlewares/validacionProducto.js";
import errorMulter from "../middlewares/errorMulter.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { verificarRol } from "../middlewares/rolMiddleware.js";

const router = Router();

router
  .route("/")
  .post(
    verificarToken,
    verificarRol("admin"),
    upload.single("imagen"),
    errorMulter,
    validacionProducto,
    agregarProducto,
  )
  .get(validacionPaginacion,listarProductos);
router
  .route("/:id")
  .get(validacionIDProducto, buscarProductoPorID)
  .delete(
    verificarToken,
    verificarRol("admin"),
    validacionIDProducto,
    borrarProductoPorID,
  )
  .put(
    verificarToken,
    verificarRol("admin"),
    upload.single("imagen"),
    errorMulter,
    validacionIDProducto,
    validacionProducto,
    editarProductoPorID,
  )
  .patch(
    verificarToken,
    verificarRol("admin"),
    upload.single("imagen"),
    errorMulter,
    validacionIDProducto,
    validacionPatchProducto,
    editarProductoPorID,
  );

export default router;
