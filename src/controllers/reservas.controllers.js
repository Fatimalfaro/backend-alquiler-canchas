import Reserva from "../models/reserva.js";
import Cancha from "../models/cancha.js";

export const crearReserva = async (req, res) => {
  try {
    const { cancha, fecha, horaInicio } = req.body;

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

    // Calcular automáticamente la hora de finalización
    const [hora, minutos] = horaInicio.split(":").map(Number);
    let horaFin;

    if (hora === 23) {
      horaFin = "00:00";
    } else {
      const horaFinNumero = hora + 1;

      horaFin = `${String(horaFinNumero).padStart(2, "0")}:${String(
        minutos,
      ).padStart(2, "0")}`;
    }
    const [anio, mes, dia] = fecha.split("-").map(Number);

    const fechaReserva = new Date(anio, mes - 1, dia);
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
      horaInicio,
    });

    if (reservaExistente) {
      return res.status(409).json({
        mensaje: "La cancha ya está reservada en ese turno",
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

    // Verificar permisos
    if (
      req.usuario.rol !== "admin" &&
      reserva.usuario.toString() !== req.usuario.id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tenés permisos para editar esta reserva",
      });
    }

    // ==========================================
    // CAMBIO DE ESTADO POR PARTE DEL ADMIN
    // ==========================================

    if (req.usuario.rol === "admin" && req.body.estado) {
      const estadosPermitidos = ["pendiente", "confirmada", "cancelada"];

      if (!estadosPermitidos.includes(req.body.estado)) {
        return res.status(400).json({
          mensaje: "El estado indicado no es válido",
        });
      }

      reserva.estado = req.body.estado;

      await reserva.save();

      const reservaActualizada = await Reserva.findById(id)
        .populate("usuario", "nombre apellido email")
        .populate("cancha", "nombre tipo precio");

      return res.status(200).json({
        mensaje: "El estado de la reserva se actualizó correctamente",
        reserva: reservaActualizada,
      });
    }

    // ==========================================
    // EDICIÓN NORMAL DE CANCHA / FECHA / HORARIO
    // ==========================================

    const canchaId = req.body.cancha || reserva.cancha;

    const nuevaHoraInicio = req.body.horaInicio || reserva.horaInicio;

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

    // ==========================================
    // FECHA
    // ==========================================

    let fechaReserva;

    if (req.body.fecha) {
      const [anio, mes, dia] = req.body.fecha.split("-").map(Number);

      fechaReserva = new Date(anio, mes - 1, dia);
      fechaReserva.setHours(0, 0, 0, 0);
    } else {
      fechaReserva = new Date(reserva.fecha);
      fechaReserva.setHours(0, 0, 0, 0);
    }

    // ==========================================
    // VALIDAR FECHA PASADA
    // ==========================================

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({
        mensaje: "No se puede reservar una fecha pasada",
      });
    }

    // ==========================================
    // CALCULAR HORA FIN
    // ==========================================

    const [hora, minutos] = nuevaHoraInicio.split(":").map(Number);

    let nuevaHoraFin;

    if (hora === 23) {
      nuevaHoraFin = "00:00";
    } else {
      const horaFinNumero = hora + 1;

      nuevaHoraFin = `${String(horaFinNumero).padStart(
        2,
        "0",
      )}:${String(minutos).padStart(2, "0")}`;
    }

    // ==========================================
    // VERIFICAR DOBLE RESERVA
    // ==========================================

    const reservaExistente = await Reserva.findOne({
      _id: { $ne: id },
      cancha: canchaId,
      fecha: fechaReserva,
      estado: { $ne: "cancelada" },
      horaInicio: nuevaHoraInicio,
    });

    if (reservaExistente) {
      return res.status(409).json({
        mensaje: "La cancha ya está reservada en ese turno",
      });
    }

    // ==========================================
    // ACTUALIZAR RESERVA
    // ==========================================

    reserva.cancha = canchaId;
    reserva.fecha = fechaReserva;
    reserva.horaInicio = nuevaHoraInicio;
    reserva.horaFin = nuevaHoraFin;
    reserva.precio = canchaEncontrada.precio;

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
export const obtenerDisponibilidad = async (req, res) => {
  try {
    const { cancha, fecha } = req.params;

    // Verificar que la cancha exista
    const canchaEncontrada = await Cancha.findById(cancha);

    if (!canchaEncontrada) {
      return res.status(404).json({
        mensaje: "No se encontró la cancha indicada",
      });
    }
    // Preparar la fecha en horario local
    const [anio, mes, dia] = fecha.split("-").map(Number);

    const fechaConsulta = new Date(anio, mes - 1, dia);
    fechaConsulta.setHours(0, 0, 0, 0);

    // Buscar reservas de esa cancha y fecha
    const reservas = await Reserva.find({
      cancha,
      fecha: fechaConsulta,
      estado: { $ne: "cancelada" },
    }).select("horaInicio horaFin");

    // Generar turnos de 08:00 a 00:00
    const turnos = [];

    for (let hora = 8; hora <= 23; hora++) {
      const horaInicio = `${String(hora).padStart(2, "0")}:00`;

      let horaFin;

      if (hora === 23) {
        horaFin = "00:00";
      } else {
        horaFin = `${String(hora + 1).padStart(2, "0")}:00`;
      }

      const reservado = reservas.some(
        (reserva) => reserva.horaInicio === horaInicio,
      );

      turnos.push({
        horaInicio,
        horaFin,
        disponible: !reservado,
      });
    }

    return res.status(200).json({
      cancha: canchaEncontrada.nombre,
      fecha,
      turnos,
    });
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al obtener la disponibilidad",
    });
  }
};
