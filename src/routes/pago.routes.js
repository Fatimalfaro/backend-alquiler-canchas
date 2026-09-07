import {Router} from "express";
import { crearPreferenciaPago } from "../controllers/pago.controllers";
import {verificarToken} from "../middlewares/authMiddleware"
const router = Router();

router.route("/crear-preferencia").post(verificarToken, crearPreferenciaPago)

export default router;