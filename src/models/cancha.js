import mongoose, { Schema } from "mongoose";

const canchaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },

    descripcion: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
      trim: true,
    },

    precio: {
      type: Number,
      required: true,
      min: 0,
    },

    imagen: {
      type: String,
      required: true,
      trim: true,
    },

  

    tipo: {
      type: String,
      required: true,
      enum: ["Fútbol 5", "Fútbol 7", "Fútbol 11"],
    },

    disponible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Cancha = mongoose.model("cancha", canchaSchema);

export default Cancha;