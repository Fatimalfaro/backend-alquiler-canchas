import { Router } from "express";

import {
  registrarUsuario,
  verificarEmail,
  reenviarCodigoVerificacion,
  iniciarSesion,
  obtenerUsuarioActual,
  cerrarSesion,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuario.controllers.js";

import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/rolMiddleware.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/verificar-email", verificarEmail);
router.post("/reenviar-codigo", reenviarCodigoVerificacion);
router.post("/login", iniciarSesion);
router.get("/me", verificarToken, obtenerUsuarioActual);
router.post("/logout", cerrarSesion);

router.get("/", verificarToken, verificarRol("admin"), obtenerUsuarios);

router.get("/:id", verificarToken, obtenerUsuarioPorId);

router.put("/:id", verificarToken, actualizarUsuario);

router.delete("/:id", verificarToken, verificarRol("admin"), eliminarUsuario);

export default router;
