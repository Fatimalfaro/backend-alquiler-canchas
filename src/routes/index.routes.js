import {Router} from "express";
import productosRouter from "./productos.routes.js";
import categoriasRouter from "./categorias.routes.js";
const router = Router();

router.use("/productos", productosRouter);
router.use("/categorias", categoriasRouter);

export default router;