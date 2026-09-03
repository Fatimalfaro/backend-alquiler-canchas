import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { enviarCodigoVerificacion } from "../services/email.service.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuarioExistente = await Usuario.findOne({
      email: emailNormalizado,
    });

    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "El email ya está registrado",
      });
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

    return res.status(201).json({
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
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      mensaje: "Error al registrar usuario",
    });
  }
};

export const verificarEmail = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({
        mensaje: "Email y código son obligatorios",
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await Usuario.findOne({
      email: emailNormalizado,
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    if (usuario.emailVerificado) {
      return res.status(400).json({
        mensaje: "El email ya está verificado",
      });
    }

    if (!usuario.codigoVerificacion) {
      return res.status(400).json({
        mensaje: "No hay un código de verificación activo",
      });
    }

    if (
      !usuario.codigoVerificacionExpira ||
      usuario.codigoVerificacionExpira < new Date()
    ) {
      return res.status(400).json({
        mensaje: "El código de verificación ha expirado",
      });
    }

    if (usuario.codigoVerificacion !== codigo) {
      return res.status(400).json({
        mensaje: "El código de verificación es incorrecto",
      });
    }

    usuario.emailVerificado = true;
    usuario.codigoVerificacion = null;
    usuario.codigoVerificacionExpira = null;

    await usuario.save();

    return res.status(200).json({
      mensaje: "Email verificado correctamente",
    });
  } catch (error) {
    console.error("Error al verificar email:", error);

    return res.status(500).json({
      mensaje: "Error al verificar el email",
    });
  }
};

export const reenviarCodigoVerificacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        mensaje: "El email es obligatorio",
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await Usuario.findOne({
      email: emailNormalizado,
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    if (usuario.emailVerificado) {
      return res.status(400).json({
        mensaje: "El email ya está verificado",
      });
    }

    // Esperar 60 segundos entre códigos
    if (usuario.ultimoCodigoEnviado) {
      const segundosTranscurridos =
        (Date.now() - usuario.ultimoCodigoEnviado.getTime()) / 1000;

      if (segundosTranscurridos < 60) {
        const segundosRestantes = Math.ceil(60 - segundosTranscurridos);

        return res.status(429).json({
          mensaje: `Debes esperar ${segundosRestantes} segundos para solicitar otro código`,
        });
      }
    }

    const codigoVerificacion = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Nueva expiración: 10 minutos
    const codigoVerificacionExpira = new Date(Date.now() + 10 * 60 * 1000);

    usuario.codigoVerificacion = codigoVerificacion;
    usuario.codigoVerificacionExpira = codigoVerificacionExpira;
    usuario.ultimoCodigoEnviado = new Date();

    await usuario.save();

    await enviarCodigoVerificacion(usuario.email, codigoVerificacion);

    return res.status(200).json({
      mensaje: "Se envió un nuevo código de verificación",
    });
  } catch (error) {
    console.error("Error al reenviar código:", error);

    return res.status(500).json({
      mensaje: "Error al reenviar el código de verificación",
    });
  }
};

export const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y contraseña son obligatorios",
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await Usuario.findOne({
      email: emailNormalizado,
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        mensaje: "El usuario está desactivado",
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos",
      });
    }

    if (!usuario.emailVerificado) {
      return res.status(403).json({
        mensaje: "Debes verificar tu email antes de iniciar sesión",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        emailVerificado: usuario.emailVerificado,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
    });
  }
};

export const obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      usuario,
    });
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el usuario",
    });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    return res.status(500).json({
      mensaje: "Error al obtener los usuarios",
    });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: "El ID del usuario no es válido",
      });
    }

    // Un usuario puede consultar su propio perfil.
    // Un admin puede consultar cualquier usuario.
    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
      return res.status(403).json({
        mensaje: "No tenés permisos para consultar este usuario",
      });
    }

    const usuario = await Usuario.findById(id).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el usuario",
    });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, rol, activo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: "El ID del usuario no es válido",
      });
    }

    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
      return res.status(403).json({
        mensaje: "No tenés permisos para modificar este usuario",
      });
    }

    const datosActualizar = {};

    if (nombre !== undefined) {
      datosActualizar.nombre = nombre;
    }

    if (apellido !== undefined) {
      datosActualizar.apellido = apellido;
    }

    if (email !== undefined) {
      const emailNormalizado = email.toLowerCase().trim();

      // Verificar que el nuevo email no pertenezca a otro usuario
      const emailExistente = await Usuario.findOne({
        email: emailNormalizado,
        _id: { $ne: id },
      });

      if (emailExistente) {
        return res.status(400).json({
          mensaje: "El email ya está registrado por otro usuario",
        });
      }

      datosActualizar.email = emailNormalizado;
    }

    if (password !== undefined) {
      datosActualizar.password = await bcrypt.hash(password, 10);
    }

    // Solo admin puede modificar rol
    if (req.usuario.rol === "admin" && rol !== undefined) {
      datosActualizar.rol = rol;
    }

    // Solo admin puede activar/desactivar usuarios
    if (req.usuario.rol === "admin" && activo !== undefined) {
      datosActualizar.activo = activo;
    }

    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        mensaje: "No hay datos válidos para actualizar",
      });
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
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    return res.status(500).json({
      mensaje: "Error al actualizar el usuario",
    });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: "El ID del usuario no es válido",
      });
    }

    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    return res.status(500).json({
      mensaje: "Error al eliminar el usuario",
    });
  }
};

export const cerrarSesion = (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    mensaje: "Sesión cerrada correctamente",
  });
};
