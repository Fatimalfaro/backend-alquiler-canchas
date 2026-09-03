import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    apellido: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },

    rol: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
    },

    activo: {
      type: Boolean,
      default: true,
    },

    emailVerificado: {
      type: Boolean,
      default: false,
    },

    codigoVerificacion: {
      type: String,
      default: null,
    },

    codigoVerificacionExpira: {
      type: Date,
      default: null,
    },

    ultimoCodigoEnviado: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Usuario", usuarioSchema);
