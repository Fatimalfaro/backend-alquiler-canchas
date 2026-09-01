import {Router} from "express";
import { agregarProducto, listarProductos } from "../controllers/productos.controllers.js";

const router = Router();

router.route("/").post(agregarProducto).get(listarProductos);

export default router;