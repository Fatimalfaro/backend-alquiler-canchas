import {
  crearPreferenciaPagoService,
  crearPreferenciaPagoReservaService,
  recibirWebhookService,
  obtenerMisComprasService,
} from "../services/pago.service.js";

// CREAR PREFERENCIA DE PAGO
export const crearPreferenciaPago = async (req, res, next) => {
  try {
    const userId = req.usuario.id;

    const resultado = await crearPreferenciaPagoService(userId);

    res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};

// CREAR PREFERENCIA DE PAGO PARA RESERVA
export const crearPreferenciaPagoReserva = async (req, res, next) => {
  try {
    const { reservaId } = req.body;
    const usuarioId = req.usuario.id;

    const resultado = await crearPreferenciaPagoReservaService(
      reservaId,
      usuarioId,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};

// RECIBIR WEBHOOK
export const recibirWebhook = async (req, res, next) => {
  try {
    const resultado = await recibirWebhookService(req.query, req.body);

    if (resultado.sendStatus) {
      return res.sendStatus(resultado.sendStatus);
    }

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    return next(error);
  }
};

// OBTENER MIS COMPRAS
export const obtenerMisCompras = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await obtenerMisComprasService(usuarioId);

    res.status(200).json({
      ordenes,
    });
  } catch (error) {
    return next(error);
  }
};
