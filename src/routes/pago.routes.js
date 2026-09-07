import {Router} from "express";
import { crearPreferenciaPago } from "../controllers/pago.controllers.js";
import {verificarToken} from "../middlewares/authMiddleware.js"
const router = Router();

router.route("/crear-preferencia").post(verificarToken, crearPreferenciaPago)

export default router;