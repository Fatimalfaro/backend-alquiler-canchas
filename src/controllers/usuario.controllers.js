
import {
  registrarUsuarioService,
  verificarEmailService,
  reenviarCodigoVerificacionService,
  iniciarSesionService,
  obtenerUsuarioActualService,
  obtenerUsuariosService,
  obtenerUsuarioPorIdService,
  actualizarUsuarioService,
  eliminarUsuarioService,
} from "../services/usuario.service.js";

// REGISTRAR USUARIO
export const registrarUsuario = async (req, res) => {
  try {
    const resultado = await registrarUsuarioService(req.body);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      mensaje: "Error al registrar usuario",
    });
  }
};

// VERIFICAR EMAIL
export const verificarEmail = async (req, res) => {
  try {
    const resultado = await verificarEmailService(req.body);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al verificar email:", error);

    return res.status(500).json({
      mensaje: "Error al verificar el email",
    });
  }
};

// REENVIAR CODIGO DE VERIFICACION
export const reenviarCodigoVerificacion = async (req, res) => {
  try {
    const resultado = await reenviarCodigoVerificacionService(
      req.body,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al reenviar código:", error);

    return res.status(500).json({
      mensaje: "Error al reenviar el código de verificación",
    });
  }
};

// INICIAR SESION
export const iniciarSesion = async (req, res) => {
  try {
    const resultado = await iniciarSesionService(req.body);

    if (resultado.token) {
      res.cookie("token", resultado.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000, // 1 hora
      });
    }

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
    });
  }
};

// OBTENER USUARIO ACTUAL
export const obtenerUsuarioActual = async (req, res) => {
  try {
    const resultado = await obtenerUsuarioActualService(
      req.usuario.id,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el usuario",
    });
  }
};

// OBTENER TODOS LOS USUARIOS
export const obtenerUsuarios = async (req, res) => {
  try {
    const resultado = await obtenerUsuariosService(req.query);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    return res.status(500).json({
      mensaje: "Error al obtener los usuarios",
    });
  }
};

// OBTENER USUARIO POR ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await obtenerUsuarioPorIdService(
      id,
      req.usuario,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al obtener usuario:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el usuario",
    });
  }
};

// ACTUALIZAR USUARIO
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await actualizarUsuarioService(
      id,
      req.body,
      req.usuario,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    return res.status(500).json({
      mensaje: "Error al actualizar el usuario",
    });
  }
};

// ELIMINAR USUARIO
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await eliminarUsuarioService(id);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    return res.status(500).json({
      mensaje: "Error al eliminar el usuario",
    });
  }
};

// CERRAR SESION
export const cerrarSesion = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    mensaje: "Sesión cerrada correctamente",
  });
};
