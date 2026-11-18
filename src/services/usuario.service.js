import Usuario from "../models/usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { enviarCodigoVerificacion } from "./email.service.js";

export const registrarUsuarioService = async (datos) => {
  const { nombre, apellido, email, password } = datos;

  if (!nombre || !apellido || !email || !password) {
    return {
      status: 400,
      respuesta: {
        mensaje: "Todos los campos son obligatorios",
      },
    };
  }

  const emailNormalizado = email.toLowerCase().trim();

  const usuarioExistente = await Usuario.findOne({
    email: emailNormalizado,
  });

  if (usuarioExistente) {
    if (usuarioExistente.emailVerificado) {
      return {
        status: 400,
        respuesta: {
          mensaje: "El email ya está registrado y verificado.",
        },
      };
    }

    return {
      status: 200,
      respuesta: {
        mensaje:
          "Tu cuenta ya está registrada, pero falta verificar el email. Revisá tu correo o solicitá un nuevo código.",
        requiereVerificacion: true,
        usuario: {
          id: usuarioExistente._id,
          nombre: usuarioExistente.nombre,
          apellido: usuarioExistente.apellido,
          email: usuarioExistente.email,
          emailVerificado: usuarioExistente.emailVerificado,
        },
      },
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const codigoVerificacion = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const codigoVerificacionExpira = new Date(Date.now() + 10 * 60 * 1000);

  const usuarioNuevo = new Usuario({
    nombre,
    apellido,
    email: emailNormalizado,
    password: passwordHash,
    codigoVerificacion,
    codigoVerificacionExpira,
    ultimoCodigoEnviado: new Date(),
  });

  await usuarioNuevo.save();

  await enviarCodigoVerificacion(usuarioNuevo.email, codigoVerificacion);

  return {
    status: 201,
    respuesta: {
      mensaje:
        "Usuario registrado correctamente. Se envió un código de verificación a tu email.",
      usuario: {
        id: usuarioNuevo._id,
        nombre: usuarioNuevo.nombre,
        apellido: usuarioNuevo.apellido,
        email: usuarioNuevo.email,
        rol: usuarioNuevo.rol,
        emailVerificado: usuarioNuevo.emailVerificado,
      },
    },
  };
};

export const verificarEmailService = async (datos) => {
  const { email, codigo } = datos;

  if (!email || !codigo) {
    return {
      status: 400,
      respuesta: {
        mensaje: "Email y código son obligatorios",
      },
    };
  }

  const emailNormalizado = email.toLowerCase().trim();

  const usuario = await Usuario.findOne({
    email: emailNormalizado,
  });

  if (!usuario) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  if (usuario.emailVerificado) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El email ya está verificado",
      },
    };
  }

  if (!usuario.codigoVerificacion) {
    return {
      status: 400,
      respuesta: {
        mensaje: "No hay un código de verificación activo",
      },
    };
  }

  if (
    !usuario.codigoVerificacionExpira ||
    usuario.codigoVerificacionExpira < new Date()
  ) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El código de verificación ha expirado",
      },
    };
  }

  if (usuario.codigoVerificacion !== codigo) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El código de verificación es incorrecto",
      },
    };
  }

  usuario.emailVerificado = true;
  usuario.codigoVerificacion = null;
  usuario.codigoVerificacionExpira = null;

  await usuario.save();

  return {
    status: 200,
    respuesta: {
      mensaje: "Email verificado correctamente",
    },
  };
};

export const reenviarCodigoVerificacionService = async (datos) => {
  const { email } = datos;

  if (!email) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El email es obligatorio",
      },
    };
  }

  const emailNormalizado = email.toLowerCase().trim();

  const usuario = await Usuario.findOne({
    email: emailNormalizado,
  });

  if (!usuario) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  if (usuario.emailVerificado) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El email ya está verificado",
      },
    };
  }

  if (usuario.ultimoCodigoEnviado) {
    const segundosTranscurridos =
      (Date.now() - usuario.ultimoCodigoEnviado.getTime()) / 1000;

    if (segundosTranscurridos < 60) {
      const segundosRestantes = Math.ceil(60 - segundosTranscurridos);

      return {
        status: 429,
        respuesta: {
          mensaje: `Debes esperar ${segundosRestantes} segundos para solicitar otro código`,
        },
      };
    }
  }

  const codigoVerificacion = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const codigoVerificacionExpira = new Date(Date.now() + 10 * 60 * 1000);

  usuario.codigoVerificacion = codigoVerificacion;
  usuario.codigoVerificacionExpira = codigoVerificacionExpira;
  usuario.ultimoCodigoEnviado = new Date();

  await usuario.save();

  await enviarCodigoVerificacion(usuario.email, codigoVerificacion);

  return {
    status: 200,
    respuesta: {
      mensaje: "Se envió un nuevo código de verificación",
    },
  };
};

export const iniciarSesionService = async (datos) => {
  const { email, password } = datos;

  if (!email || !password) {
    return {
      status: 400,
      respuesta: {
        mensaje: "Email y contraseña son obligatorios",
      },
    };
  }

  const emailNormalizado = email.toLowerCase().trim();

  const usuario = await Usuario.findOne({
    email: emailNormalizado,
  });

  if (!usuario) {
    return {
      status: 401,
      respuesta: {
        mensaje: "Email o contraseña incorrectos",
      },
    };
  }

  if (!usuario.activo) {
    return {
      status: 403,
      respuesta: {
        mensaje: "El usuario está desactivado",
      },
    };
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password);

  if (!passwordCorrecta) {
    return {
      status: 401,
      respuesta: {
        mensaje: "Email o contraseña incorrectos",
      },
    };
  }

  if (!usuario.emailVerificado) {
    return {
      status: 403,
      respuesta: {
        mensaje: "Debes verificar tu email antes de iniciar sesión",
      },
    };
  }

  const token = jwt.sign(
    {
      id: usuario._id,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return {
    status: 200,
    token,
    respuesta: {
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        emailVerificado: usuario.emailVerificado,
      },
    },
  };
};

export const obtenerUsuarioActualService = async (usuarioId) => {
  const usuario = await Usuario.findById(usuarioId).select("-password");

  if (!usuario) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  return {
    status: 200,
    respuesta: {
      usuario,
    },
  };
};

export const obtenerUsuariosService = async (queryParams) => {
  const numeroPagina = parseInt(queryParams.pagina) || 1;
  const cantUsuarios = parseInt(queryParams.limite) || 6;
  const salto = (numeroPagina - 1) * cantUsuarios;

  const query = {
    _id: { $ne: process.env.ADMIN_PRINCIPAL_ID },
  };

  const [usuarios, cantidadUsuarios] = await Promise.all([
    Usuario.find(query).select("-password").skip(salto).limit(cantUsuarios),

    Usuario.countDocuments(query),
  ]);

  return {
    status: 200,
    respuesta: {
      usuarios,
      cantidadUsuarios,
      pagina: numeroPagina,
      limite: cantUsuarios,
    },
  };
};

export const obtenerUsuarioPorIdService = async (id, usuarioAutenticado) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El ID del usuario no es válido",
      },
    };
  }

  if (usuarioAutenticado.rol !== "admin" && usuarioAutenticado.id !== id) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No tenés permisos para consultar este usuario",
      },
    };
  }

  const usuario = await Usuario.findById(id).select("-password");

  if (!usuario) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  return {
    status: 200,
    respuesta: usuario,
  };
};

export const actualizarUsuarioService = async (
  id,
  datos,
  usuarioAutenticado,
) => {
  const { nombre, apellido, email, password, rol, activo } = datos;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El ID del usuario no es válido",
      },
    };
  }

  if (usuarioAutenticado.rol !== "admin" && usuarioAutenticado.id !== id) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No tenés permisos para modificar este usuario",
      },
    };
  }

  const usuarioActual = await Usuario.findById(id);

  if (!usuarioActual) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  if (
    usuarioActual._id.toString() === process.env.ADMIN_PRINCIPAL_ID &&
    usuarioAutenticado.id.toString() !== process.env.ADMIN_PRINCIPAL_ID
  ) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No se puede modificar el administrador principal",
      },
    };
  }

  const datosActualizar = {};

  let emailCambio = false;
  let codigoParaEnviar = null;

  if (nombre !== undefined) {
    datosActualizar.nombre = nombre;
  }

  if (apellido !== undefined) {
    datosActualizar.apellido = apellido;
  }

  if (email !== undefined) {
    const emailNormalizado = email.toLowerCase().trim();

    if (emailNormalizado !== usuarioActual.email) {
      const emailExistente = await Usuario.findOne({
        email: emailNormalizado,
        _id: { $ne: id },
      });

      if (emailExistente) {
        return {
          status: 400,
          respuesta: {
            mensaje: "El email ya está registrado por otro usuario",
          },
        };
      }

      codigoParaEnviar = Math.floor(100000 + Math.random() * 900000).toString();

      const codigoVerificacionExpira = new Date(Date.now() + 10 * 60 * 1000);

      datosActualizar.email = emailNormalizado;
      datosActualizar.emailVerificado = false;
      datosActualizar.codigoVerificacion = codigoParaEnviar;
      datosActualizar.codigoVerificacionExpira = codigoVerificacionExpira;
      datosActualizar.ultimoCodigoEnviado = new Date();

      emailCambio = true;
    }
  }

  if (password !== undefined) {
    datosActualizar.password = await bcrypt.hash(password, 10);
  }

  if (usuarioAutenticado.rol === "admin" && rol !== undefined) {
    datosActualizar.rol = rol;
  }

  if (usuarioAutenticado.rol === "admin" && activo !== undefined) {
    datosActualizar.activo = activo;
  }

  if (Object.keys(datosActualizar).length === 0) {
    return {
      status: 400,
      respuesta: {
        mensaje: "No hay datos válidos para actualizar",
      },
    };
  }

  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    id,
    datosActualizar,
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!usuarioActualizado) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  if (emailCambio) {
    await enviarCodigoVerificacion(usuarioActualizado.email, codigoParaEnviar);

    return {
      status: 200,
      respuesta: {
        mensaje:
          "Usuario actualizado correctamente. Se envió un nuevo código de verificación al email.",
        usuario: usuarioActualizado,
        requiereVerificacion: true,
      },
    };
  }

  return {
    status: 200,
    respuesta: {
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    },
  };
};

export const eliminarUsuarioService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      status: 400,
      respuesta: {
        mensaje: "El ID del usuario no es válido",
      },
    };
  }

  const usuario = await Usuario.findById(id);

  if (!usuario) {
    return {
      status: 404,
      respuesta: {
        mensaje: "Usuario no encontrado",
      },
    };
  }

  if (usuario._id.toString() === process.env.ADMIN_PRINCIPAL_ID) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No se puede eliminar el administrador principal",
      },
    };
  }

  await Usuario.findByIdAndDelete(id);

  return {
    status: 200,
    respuesta: {
      mensaje: "Usuario eliminado correctamente",
    },
  };
};
