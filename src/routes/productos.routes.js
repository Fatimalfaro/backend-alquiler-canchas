import {Router} from "express";
import { agregarProducto, listarProductos, buscarProductoPorID, borrarProductoPorID, editarProductoPorID} from "../controllers/productos.controllers.js";
import { validacionProducto } from "../middlewares/validacionProducto.js";

const router = Router();

router.route("/").post(validacionProducto, agregarProducto).get(listarProductos);
router.route("/:id").get(buscarProductoPorID).delete(borrarProductoPorID).put(editarProductoPorID).patch(editarProductoPorID);

export default router;