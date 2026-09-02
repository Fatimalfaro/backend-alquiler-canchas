import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

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

    const usuarioNuevo = new Usuario({
      nombre,
      apellido,
      email: emailNormalizado,
      password: passwordHash,
    });

    await usuarioNuevo.save();

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: usuarioNuevo._id,
        nombre: usuarioNuevo.nombre,
        apellido: usuarioNuevo.apellido,
        email: usuarioNuevo.email,
        rol: usuarioNuevo.rol,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al registrar usuario",
    });
  }
};