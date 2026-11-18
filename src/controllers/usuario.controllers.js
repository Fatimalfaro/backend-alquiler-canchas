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

const responderResultado = (resultado, res, next) => {
  if (resultado.status >= 400) {
    const error = new Error(
      resultado.respuesta?.mensaje || "Error en la solicitud"
    );

    error.statusCode = resultado.status;
    error.payload = resultado.respuesta;

    return next(error);
  }

  return res.status(resultado.status).json(resultado.respuesta);
};

export const registrarUsuario = async (req, res, next) => {
  try {
    const resultado = await registrarUsuarioService(req.body);

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const verificarEmail = async (req, res, next) => {
  try {
    const resultado = await verificarEmailService(req.body);

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const reenviarCodigoVerificacion = async (req, res, next) => {
  try {
    const resultado = await reenviarCodigoVerificacionService(req.body);

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const iniciarSesion = async (req, res, next) => {
  try {
    const resultado = await iniciarSesionService(req.body);

    if (resultado.token) {
      res.cookie("token", resultado.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });
    }

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const obtenerUsuarioActual = async (req, res, next) => {
  try {
    const resultado = await obtenerUsuarioActualService(
      req.usuario.id
    );

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const obtenerUsuarios = async (req, res, next) => {
  try {
    const resultado = await obtenerUsuariosService(req.query);

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

// OBTENER USUARIO POR ID
export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultado = await obtenerUsuarioPorIdService(
      id,
      req.usuario
    );

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultado = await actualizarUsuarioService(
      id,
      req.body,
      req.usuario
    );

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

export const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultado = await eliminarUsuarioService(id);

    return responderResultado(resultado, res, next);
  } catch (error) {
    return next(error);
  }
};

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
