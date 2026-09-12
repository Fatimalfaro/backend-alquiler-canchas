import { Router } from "express";

import {
  crearPreferenciaPago,
  crearPreferenciaPagoReserva,
  recibirWebhook,
} from "../controllers/pago.controllers.js";

import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/crear-preferencia").post(verificarToken, crearPreferenciaPago);

router
  .route("/crear-preferencia-reserva")
  .post(verificarToken, crearPreferenciaPagoReserva);

router.route("/webhook").get(recibirWebhook).post(recibirWebhook);

export default router;
