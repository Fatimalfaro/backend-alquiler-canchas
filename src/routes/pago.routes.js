import {Router} from "express";
import { crearPreferenciaPago, recibirWebhook } from "../controllers/pago.controllers.js";
import {verificarToken} from "../middlewares/authMiddleware.js"
const router = Router();

router.route("/crear-preferencia").post(verificarToken, crearPreferenciaPago);
router.route("/webhook").post(recibirWebhook);

export default router;