import {Router} from "express";
import productos from "./productos.routes.js";
const router = Router();

router.use("/producto", productos);

export default router;