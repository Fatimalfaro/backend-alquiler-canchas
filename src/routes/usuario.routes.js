import { Router } from "express";
import {
  registrarUsuario,
  verificarEmail,
} from "../controllers/usuario.controllers.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/verificar-email", verificarEmail);
export default router;
