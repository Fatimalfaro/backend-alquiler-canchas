import { Router } from "express";

import productos from "./productos.routes.js";
import usuarios from "./usuario.routes.js";

const router = Router();

router.use("/producto", productos);
router.use("/usuario", usuarios);

export default router;