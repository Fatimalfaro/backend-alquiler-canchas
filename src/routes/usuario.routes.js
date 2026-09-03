import { Router } from "express";
import {
  registrarUsuario,
  verificarEmail,
  reenviarCodigoVerificacion
} from "../controllers/usuario.controllers.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/verificar-email", verificarEmail);
router.post("/reenviar-codigo", reenviarCodigoVerificacion);
export default router;
