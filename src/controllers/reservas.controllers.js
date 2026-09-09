import Reserva from "../models/reserva.js";
import Cancha from "../models/cancha.js";

export const crearReserva = async (req, res) => {
  try {
    const { cancha, fecha, horaInicio, horaFin } = req.body;

    const usuario = req.usuario.id;

    const canchaEncontrada = await Cancha.findById(cancha);

    if (!canchaEncontrada) {
      return res.status(404).json({
        mensaje: "No se encontró la cancha indicada",
      });
    }

    if (!canchaEncontrada.disponible) {
      return res.status(400).json({
        mensaje: "La cancha no está disponible",
      });
    }

    if (horaFin <= horaInicio) {
      return res.status(400).json({
        mensaje: "La hora de fin debe ser posterior a la hora de inicio",
      });
    }

    const fechaReserva = new Date(fecha);
    fechaReserva.setHours(0, 0, 0, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({
        mensaje: "No se puede reservar una fecha pasada",
      });
    }

    const reservaExistente = await Reserva.findOne({
      cancha,
      fecha: fechaReserva,
      estado: { $ne: "cancelada" },
      horaInicio: { $lt: horaFin },
      horaFin: { $gt: horaInicio },
    });

    if (reservaExistente) {
      return res.status(409).json({
        mensaje: "La cancha ya está reservada en ese horario",
      });
    }

    const nuevaReserva = new Reserva({
      usuario,
      cancha,
      fecha: fechaReserva,
      horaInicio,
      horaFin,
      precio: canchaEncontrada.precio,
      estado: "pendiente",
    });

    await nuevaReserva.save();

    const reservaCreada = await Reserva.findById(nuevaReserva._id)
      .populate("usuario", "nombre apellido email")
      .populate("cancha", "nombre tipo precio");

    return res.status(201).json({
      mensaje: "Reserva creada correctamente",
      reserva: reservaCreada,
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al crear la reserva",
    });
  }
};

export const listarReservas = async (req, res) => {
  try {
    let filtro = {};

    if (req.usuario.rol !== "admin") {
      filtro.usuario = req.usuario.id;
    }

    const reservas = await Reserva.find(filtro)
      .populate("usuario", "nombre apellido email")
      .populate("cancha", "nombre tipo precio")
      .sort({ fecha: 1, horaInicio: 1 });

    return res.status(200).json({
      reservas,
    });
  } catch (error) {
    console.error("Error al listar reservas:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al listar las reservas",
    });
  }
};

export const buscarReservaPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id)
      .populate("usuario", "nombre apellido email")
      .populate("cancha", "nombre tipo precio");

    if (!reserva) {
      return res.status(404).json({
        mensaje: "No se encontró la reserva",
      });
    }

    if (
      req.usuario.rol !== "admin" &&
      reserva.usuario._id.toString() !== req.usuario.id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tenés permisos para consultar esta reserva",
      });
    }

    return res.status(200).json({
      reserva,
    });
  } catch (error) {
    console.error("Error al buscar reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al buscar la reserva",
    });
  }
};

export const editarReservaPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({
        mensaje: "No se encontró la reserva",
      });
    }

    if (
      req.usuario.rol !== "admin" &&
      reserva.usuario.toString() !== req.usuario.id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tenés permisos para editar esta reserva",
      });
    }

    const canchaId = req.body.cancha || reserva.cancha;
    const nuevaFecha = req.body.fecha || reserva.fecha;
    const nuevaHoraInicio = req.body.horaInicio || reserva.horaInicio;
    const nuevaHoraFin = req.body.horaFin || reserva.horaFin;

    // Verificar cancha
    const canchaEncontrada = await Cancha.findById(canchaId);

    if (!canchaEncontrada) {
      return res.status(404).json({
        mensaje: "No se encontró la cancha indicada",
      });
    }

    if (!canchaEncontrada.disponible) {
      return res.status(400).json({
        mensaje: "La cancha no está disponible",
      });
    }

    if (nuevaHoraFin <= nuevaHoraInicio) {
      return res.status(400).json({
        mensaje: "La hora de fin debe ser posterior a la hora de inicio",
      });
    }

    const fechaReserva = new Date(nuevaFecha);
    fechaReserva.setHours(0, 0, 0, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({
        mensaje: "No se puede reservar una fecha pasada",
      });
    }

    const reservaExistente = await Reserva.findOne({
      _id: { $ne: id },
      cancha: canchaId,
      fecha: fechaReserva,
      estado: { $ne: "cancelada" },
      horaInicio: { $lt: nuevaHoraFin },
      horaFin: { $gt: nuevaHoraInicio },
    });

    if (reservaExistente) {
      return res.status(409).json({
        mensaje: "La cancha ya está reservada en ese horario",
      });
    }

    let nuevoEstado = reserva.estado;

    if (req.usuario.rol === "admin" && req.body.estado) {
      nuevoEstado = req.body.estado;
    }

    reserva.cancha = canchaId;
    reserva.fecha = fechaReserva;
    reserva.horaInicio = nuevaHoraInicio;
    reserva.horaFin = nuevaHoraFin;

    reserva.precio = canchaEncontrada.precio;

    reserva.estado = nuevoEstado;

    await reserva.save();

    const reservaActualizada = await Reserva.findById(id)
      .populate("usuario", "nombre apellido email")
      .populate("cancha", "nombre tipo precio");

    return res.status(200).json({
      mensaje: "La reserva se actualizó correctamente",
      reserva: reservaActualizada,
    });
  } catch (error) {
    console.error("Error al editar reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al editar la reserva",
    });
  }
};

export const borrarReservaPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({
        mensaje: "No se encontró la reserva",
      });
    }

    if (
      req.usuario.rol !== "admin" &&
      reserva.usuario.toString() !== req.usuario.id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tenés permisos para cancelar esta reserva",
      });
    }

    reserva.estado = "cancelada";

    await reserva.save();

    return res.status(200).json({
      mensaje: "La reserva se canceló correctamente",
      reserva,
    });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al cancelar la reserva",
    });
  }
};
