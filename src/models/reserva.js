import { Schema, model } from "mongoose";

const reservaSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    cancha: {
      type: Schema.Types.ObjectId,
      ref: "Cancha",
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
    preferenceId: {
      type: String, // ¡Importante para el Punto 2 (trazabilidad de pago)!
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

reservaSchema.index(
  { cancha: 1, fecha: 1, horaInicio: 1 },
  {
    unique: true,
    partialFilterExpression: { estado: { $ne: "cancelada" } },
  },
);
export default model('Reserva', reservaSchema);