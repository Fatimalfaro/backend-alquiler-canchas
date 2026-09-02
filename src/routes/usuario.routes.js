import { Router } from "express";
import { registrarUsuario } from "../controllers/usuario.controller.js";

const router = Router();

router.post("/registro", registrarUsuario);

export default router;