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
  validacionDisponibilidad,
  validacionPaginacion,
} from "../middlewares/validacionReserva.js";

import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();


router.use(verificarToken);

router.get("/", validacionPaginacion,listarReservas);
router.post("/", validacionReserva, crearReserva);

router.get(
  "/disponibilidad/:cancha/:fecha",
  validacionDisponibilidad, 
  obtenerDisponibilidad
);

router.get("/:id", validacionIDReserva, buscarReservaPorID);

router.patch(
  "/:id",
  validacionIDReserva,
  validacionPatchReserva,
  editarReservaPorID
);

router.delete("/:id", validacionIDReserva, borrarReservaPorID);

export default router;