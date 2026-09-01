import {Router} from "express";
import { agregarProducto, listarProductos, buscarProductoPorID, borrarProductoPorID, editarProductoPorID} from "../controllers/productos.controllers.js";
import { validacionProducto, validacionIDProducto, validacionPatchProducto } from "../middlewares/validacionProducto.js";

const router = Router();

router.route("/").post(validacionProducto, agregarProducto).get(listarProductos);
router.route("/:id").get(validacionIDProducto, buscarProductoPorID).delete(validacionIDProducto, borrarProductoPorID).put([validacionIDProducto, validacionProducto], editarProductoPorID).patch([validacionIDProducto, validacionPatchProducto], editarProductoPorID);

export default router;