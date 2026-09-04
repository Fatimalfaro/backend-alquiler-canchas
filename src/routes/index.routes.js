import { Router } from "express";
import productos from "./productos.routes.js";
import usuarios from "./usuario.routes.js";
import categorias from "./categorias.routes.js";
import carrito from "./carrito.routes.js";

const router = Router();

router.use("/producto", productos);
router.use("/usuario", usuarios);
router.use("/categorias", categorias);
router.use("/carrito", carrito);

export default router;