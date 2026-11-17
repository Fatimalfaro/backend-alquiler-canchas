import {
  crearPreferenciaPagoService,
  crearPreferenciaPagoReservaService,
  recibirWebhookService,
  obtenerMisComprasService,
} from "../services/pago.service.js";

// CREAR PREFERENCIA DE PAGO
export const crearPreferenciaPago = async (req, res) => {
  try {
    const userId = req.usuario.id;

    const resultado = await crearPreferenciaPagoService(userId);

    res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Ocurrió un error al crear la preferencia de pago",
    });
  }
};

// CREAR PREFERENCIA DE PAGO PARA RESERVA
export const crearPreferenciaPagoReserva = async (req, res) => {
  try {
    const { reservaId } = req.body;
    const usuarioId = req.usuario.id;

    const resultado = await crearPreferenciaPagoReservaService(
      reservaId,
      usuarioId,
    );

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("Error detallado al crear preferencia de reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al crear la preferencia de pago",
      detalles: error.message,
    });
  }
};

// RECIBIR WEBHOOK
export const recibirWebhook = async (req, res) => {
  try {
    const resultado = await recibirWebhookService(req.query, req.body);

    if (resultado.sendStatus) {
      return res.sendStatus(resultado.sendStatus);
    }

    return res.status(resultado.status).json(resultado.respuesta);
  } catch (error) {
    console.error("❌ Error crítico en Webhook:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// OBTENER MIS COMPRAS
export const obtenerMisCompras = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await obtenerMisComprasService(usuarioId);

    res.status(200).json({
      ordenes,
    });
  } catch (error) {
    console.error("Error al obtener mis compras:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al obtener tus compras",
    });
  }
};
