import { Router } from "express";

import {
  crearReserva,
  listarReservas,
  buscarReservaPorID,
  editarReservaPorID,
  borrarReservaPorID,
   obtenerDisponibilidad,
} from "../controllers/reservas.controllers.js";

import {
  validacionReserva,
  validacionIDReserva,
  validacionPatchReserva,
} from "../middlewares/validacionReserva.js";

import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, listarReservas);

router.post("/", verificarToken, validacionReserva, crearReserva);
router.get(
  "/disponibilidad/:cancha/:fecha",
  verificarToken,
  obtenerDisponibilidad,
);

router.get("/:id", verificarToken, validacionIDReserva, buscarReservaPorID);

router.patch(
  "/:id",
  verificarToken,
  validacionIDReserva,
  validacionPatchReserva,
  editarReservaPorID,
);

router.delete("/:id", verificarToken, validacionIDReserva, borrarReservaPorID);

export default router;
