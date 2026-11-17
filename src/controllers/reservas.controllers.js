import {
  crearReservaService,
  listarReservasService,
  buscarReservaPorIDService,
  editarReservaPorIDService,
  borrarReservaPorIDService,
  obtenerDisponibilidadService,
} from "../services/reserva.service.js";

// CREAR RESERVA
export const crearReserva = async (req, res) => {
  try {
    const { cancha, fecha, horaInicio } = req.body;
    const usuario = req.usuario.id;

    const resultado = await crearReservaService(
      { cancha, fecha, horaInicio },
      usuario,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Lo sentimos, esta cancha ya fue reservada para ese horario por otro usuario.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al procesar la reserva",
      error: error.message,
    });
  }
};

// LISTAR RESERVAS
export const listarReservas = async (req, res) => {
  try {
    const resultado = await listarReservasService(req.query, req.usuario);

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al listar reservas:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al listar las reservas",
    });
  }
};

// BUSCAR RESERVA POR ID
export const buscarReservaPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await buscarReservaPorIDService(id, req.usuario);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al buscar reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al buscar la reserva",
    });
  }
};

// EDITAR RESERVA POR ID
export const editarReservaPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await editarReservaPorIDService(
      id,
      req.body,
      req.usuario,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al editar reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al editar la reserva",
    });
  }
};

// BORRAR RESERVA POR ID
export const borrarReservaPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await borrarReservaPorIDService(id, req.usuario);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al cancelar reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al cancelar la reserva",
    });
  }
};

// OBTENER DISPONIBILIDAD
export const obtenerDisponibilidad = async (req, res) => {
  try {
    const { cancha, fecha } = req.params;

    const resultado = await obtenerDisponibilidadService(cancha, fecha);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al obtener la disponibilidad",
    });
  }
};
