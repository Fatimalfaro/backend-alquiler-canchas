import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
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

    res.status(201).json({
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
    console.error(error);

    res.status(500).json({
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

    if (usuario.codigoVerificacionExpira < new Date()) {
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
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al verificar el email",
    });
  }
};