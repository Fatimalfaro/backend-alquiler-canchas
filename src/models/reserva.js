import mongoose, { Schema } from "mongoose";

const reservaSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    cancha: {
      type: Schema.Types.ObjectId,
      ref: "cancha",
      required: true,
    },

    fecha: {
      type: Date,
      required: true,
    },

    horaInicio: {
      type: String,
      required: true,
    },

    horaFin: {
      type: String,
      required: true,
    },

    precio: {
      type: Number,
      required: true,
      min: 0,
    },

    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
  },
);

const Reserva = mongoose.model("reserva", reservaSchema);

export default Reserva;
