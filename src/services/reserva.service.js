import Reserva from "../models/reserva.js";
import Cancha from "../models/cancha.js";

// CREAR RESERVA
export const crearReservaService = async (datos, usuario) => {
  const { cancha, fecha, horaInicio } = datos;

  const canchaEncontrada = await Cancha.findById(cancha);

  if (!canchaEncontrada) {
    return {
      status: 404,
      respuesta: {
        mensaje: "No se encontró la cancha indicada",
      },
    };
  }

  if (!canchaEncontrada.disponible) {
    return {
      status: 400,
      respuesta: {
        mensaje: "La cancha no está disponible",
      },
    };
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
    return {
      status: 400,
      respuesta: {
        mensaje: "No se puede reservar una fecha pasada",
      },
    };
  }

  const reservaExistente = await Reserva.findOne({
    cancha,
    fecha: fechaReserva,
    estado: { $ne: "cancelada" },
    horaInicio,
  });

  if (reservaExistente) {
    return {
      status: 409,
      respuesta: {
        mensaje: "La cancha ya está reservada en ese turno",
      },
    };
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

  return {
    status: 201,
    respuesta: {
      mensaje: "Reserva creada correctamente",
      reserva: reservaCreada,
    },
  };
};

// LISTAR RESERVAS
export const listarReservasService = async (queryParams, usuario) => {
  const numeroPagina = parseInt(queryParams.pagina) || 1;
  const cantReservas = parseInt(queryParams.limite) || 6;
  const salto = (numeroPagina - 1) * cantReservas;

  const query = {};

  if (usuario.rol !== "admin") {
    query.usuario = usuario.id;
  }

  const [reservas, cantidadReservas] = await Promise.all([
    Reserva.find(query)
      .populate("usuario", "nombre apellido email")
      .populate("cancha", "nombre tipo precio")
      .sort({ fecha: 1, horaInicio: 1 })
      .skip(salto)
      .limit(cantReservas),

    Reserva.countDocuments(query),
  ]);

  return {
    reservas,
    cantidadReservas,
    pagina: numeroPagina,
    limite: cantReservas,
  };
};

// BUSCAR RESERVA POR ID
export const buscarReservaPorIDService = async (id, usuario) => {
  const reserva = await Reserva.findById(id)
    .populate("usuario", "nombre apellido email")
    .populate("cancha", "nombre tipo precio");

  if (!reserva) {
    return {
      status: 404,
      respuesta: {
        mensaje: "No se encontró la reserva",
      },
    };
  }

  if (
    usuario.rol !== "admin" &&
    reserva.usuario._id.toString() !== usuario.id.toString()
  ) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No tenés permisos para consultar esta reserva",
      },
    };
  }

  return {
    status: 200,
    respuesta: {
      reserva,
    },
  };
};

// EDITAR RESERVA POR ID
export const editarReservaPorIDService = async (id, datos, usuario) => {
  const userRole = usuario.rol;

  const reserva = await Reserva.findById(id);

  if (!reserva) {
    return {
      status: 404,
      respuesta: {
        mensaje: "No se encontró la reserva",
      },
    };
  }

  // Verificar si es admin o si la reserva pertenece al usuario
  if (
    userRole !== "admin" &&
    reserva.usuario.toString() !== usuario.id.toString()
  ) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No tenés permisos para editar esta reserva",
      },
    };
  }

  // 1. Explicitar campos permitidos según el rol
  const camposPermitidosAdmin = ["estado", "cancha", "fecha", "horaInicio"];
  const camposPermitidosUsuario = ["cancha", "fecha", "horaInicio"];
  const camposPermitidos =
    userRole === "admin" ? camposPermitidosAdmin : camposPermitidosUsuario;

  // 2. Rechazar campos no permitidos o si un usuario intenta enviar 'estado'
  const camposEnviados = Object.keys(datos);
  const camposInvalidos = camposEnviados.filter(
    (campo) => !camposPermitidos.includes(campo),
  );

  if (camposInvalidos.length > 0) {
    return {
      status: 400,
      respuesta: {
        success: false,
        mensaje:
          userRole !== "admin" && camposInvalidos.includes("estado")
            ? "Los usuarios no administradores no pueden modificar el estado de la reserva"
            : `Campos no permitidos para tu rol: ${camposInvalidos.join(", ")}`,
        camposPermitidosParaTuRol: camposPermitidos,
      },
    };
  }

  // Si es admin y actualiza el estado
  if (userRole === "admin" && datos.estado) {
    const estadosPermitidos = ["pendiente", "confirmada", "cancelada"];

    if (!estadosPermitidos.includes(datos.estado)) {
      return {
        status: 400,
        respuesta: {
          mensaje: "El estado indicado no es válido",
        },
      };
    }

    reserva.estado = datos.estado;

    // Si solo mandó estado, guardamos y retornamos directamente
    if (!datos.cancha && !datos.fecha && !datos.horaInicio) {
      await reserva.save();

      const reservaActualizada = await Reserva.findById(id)
        .populate("usuario", "nombre apellido email")
        .populate("cancha", "nombre tipo precio");

      return {
        status: 200,
        respuesta: {
          mensaje: "El estado de la reserva se actualizó correctamente",
          reserva: reservaActualizada,
        },
      };
    }
  }

  const canchaId = datos.cancha || reserva.cancha;
  const nuevaHoraInicio = datos.horaInicio || reserva.horaInicio;

  const canchaEncontrada = await Cancha.findById(canchaId);

  if (!canchaEncontrada) {
    return {
      status: 404,
      respuesta: {
        mensaje: "No se encontró la cancha indicada",
      },
    };
  }

  if (!canchaEncontrada.disponible) {
    return {
      status: 400,
      respuesta: {
        mensaje: "La cancha no está disponible",
      },
    };
  }

  let fechaReserva;

  if (datos.fecha) {
    const [anio, mes, dia] = datos.fecha.split("-").map(Number);

    fechaReserva = new Date(anio, mes - 1, dia);
    fechaReserva.setHours(0, 0, 0, 0);
  } else {
    fechaReserva = new Date(reserva.fecha);
    fechaReserva.setHours(0, 0, 0, 0);
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaReserva < hoy) {
    return {
      status: 400,
      respuesta: {
        mensaje: "No se puede reservar una fecha pasada",
      },
    };
  }

  const [hora, minutos] = nuevaHoraInicio.split(":").map(Number);

  let nuevaHoraFin;

  if (hora === 23) {
    nuevaHoraFin = "00:00";
  } else {
    const horaFinNumero = hora + 1;

    nuevaHoraFin = `${String(horaFinNumero).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  const reservaExistente = await Reserva.findOne({
    _id: { $ne: id },
    cancha: canchaId,
    fecha: fechaReserva,
    estado: { $ne: "cancelada" },
    horaInicio: nuevaHoraInicio,
  });

  if (reservaExistente) {
    return {
      status: 409,
      respuesta: {
        mensaje: "La cancha ya está reservada en ese turno",
      },
    };
  }

  reserva.cancha = canchaId;
  reserva.fecha = fechaReserva;
  reserva.horaInicio = nuevaHoraInicio;
  reserva.horaFin = nuevaHoraFin;
  reserva.precio = canchaEncontrada.precio;

  await reserva.save();

  const reservaActualizada = await Reserva.findById(id)
    .populate("usuario", "nombre apellido email")
    .populate("cancha", "nombre tipo precio");

  return {
    status: 200,
    respuesta: {
      mensaje: "La reserva se actualizó correctamente",
      reserva: reservaActualizada,
    },
  };
};

// BORRAR RESERVA POR ID
export const borrarReservaPorIDService = async (id, usuario) => {
  const reserva = await Reserva.findById(id);

  if (!reserva) {
    return {
      status: 404,
      respuesta: {
        mensaje: "No se encontró la reserva",
      },
    };
  }

  if (
    usuario.rol !== "admin" &&
    reserva.usuario.toString() !== usuario.id.toString()
  ) {
    return {
      status: 403,
      respuesta: {
        mensaje: "No tenés permisos para cancelar esta reserva",
      },
    };
  }

  reserva.estado = "cancelada";

  await reserva.save();

  return {
    status: 200,
    respuesta: {
      mensaje: "La reserva se canceló correctamente",
      reserva,
    },
  };
};

// OBTENER DISPONIBILIDAD
export const obtenerDisponibilidadService = async (cancha, fecha) => {
  const canchaEncontrada = await Cancha.findById(cancha);

  if (!canchaEncontrada) {
    return {
      status: 404,
      respuesta: {
        mensaje: "No se encontró la cancha indicada",
      },
    };
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);

  const fechaConsulta = new Date(anio, mes - 1, dia);
  fechaConsulta.setHours(0, 0, 0, 0);

  const reservas = await Reserva.find({
    cancha,
    fecha: fechaConsulta,
    estado: { $ne: "cancelada" },
  }).select("horaInicio horaFin");

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

  return {
    status: 200,
    respuesta: {
      cancha: canchaEncontrada.nombre,
      fecha,
      turnos,
    },
  };
};
