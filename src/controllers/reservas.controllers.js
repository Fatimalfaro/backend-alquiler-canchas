import {
  crearReservaService,
  listarReservasService,
  buscarReservaPorIDService,
  editarReservaPorIDService,
  borrarReservaPorIDService,
  obtenerDisponibilidadService,
} from "../services/reserva.service.js";

export const crearReserva = async (req, res, next) => {
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

   return next(error);
  }
};

export const listarReservas = async (req, res, next) => {
  try {
    const resultado = await listarReservasService(req.query, req.usuario);

    res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const buscarReservaPorID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultado = await buscarReservaPorIDService(id, req.usuario);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};

export const editarReservaPorID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultado = await editarReservaPorIDService(
      id,
      req.body,
      req.usuario,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};

export const borrarReservaPorID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resultado = await borrarReservaPorIDService(id, req.usuario);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};

export const obtenerDisponibilidad = async (req, res, next) => {
  try {
    const { cancha, fecha } = req.params;

    const resultado = await obtenerDisponibilidadService(cancha, fecha);

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};
