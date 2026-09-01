import {Router} from "express";
import { agregarProducto, listarProductos, buscarProductoPorID } from "../controllers/productos.controllers.js";

const router = Router();

router.route("/").post(agregarProducto).get(listarProductos);
router.route("/:id").get(buscarProductoPorID);

export default router;