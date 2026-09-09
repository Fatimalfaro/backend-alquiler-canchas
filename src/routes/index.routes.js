import { Router } from "express";
import productos from "./productos.routes.js";
import usuarios from "./usuario.routes.js";
import categorias from "./categorias.routes.js";
import carrito from "./carrito.routes.js";
import pagoRouter from "./pago.routes.js";
import canchas from "./canchas.routes.js";
import reservas from "./reservas.routes.js";

const router = Router();

router.use("/producto", productos);
router.use("/usuario", usuarios);
router.use("/categorias", categorias);
router.use("/carrito", carrito);
router.use("/pago", pagoRouter);
router.use("/canchas", canchas);
router.use("/reservas", reservas);

export default router;
