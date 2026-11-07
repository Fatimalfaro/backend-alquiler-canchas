import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";
import Orden from "../models/orden.js";
import Reserva from "../models/reserva.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const crearPreferenciaPago = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const carrito = await buscarOcrearCarrito(userId);
    await carrito.populate("items.producto");

    if (carrito.items.length === 0) {
      return res.status(400).json({ mensaje: "El carrito esta vacio" });
    }

    let montoTotal = 0;

    const itemsMP = carrito.items.map((item) => {
      const subTotal = item.producto.precio * item.cantidad;
      montoTotal += subTotal;

      return {
        id: item.producto._id.toString(),
        title: item.producto.nombreProducto,
        unit_price: Number(item.producto.precio),
        quantity: Number(item.cantidad),
        currency_id: "ARS",
        picture_url: item.producto.imagen,
      };
    });

    const itemsOrden = carrito.items.map((item) => ({
      producto: item.producto._id,
      nombreProducto: item.producto.nombreProducto,
      precioUnitario: item.producto.precio,
      cantidad: item.cantidad,
    }));

    const nuevaOrden = new Orden({
      usuario: userId,
      items: itemsOrden,
      montoTotal,
      estado: "pendiente",
    });

    await nuevaOrden.save();

    const preference = new Preference(client);

    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
    console.log(
      "SUCCESS URL:",
      `${process.env.FRONTEND_URL}/checkout/resultado?status=success`,
    );

    const result = await preference.create({
      body: {
        items: itemsMP,
        external_reference: nuevaOrden._id.toString(),
        notification_url: `${process.env.BACKEND_URL}/api/pago/webhook`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/resultado?status=success`,
          failure: `${process.env.FRONTEND_URL}/checkout/resultado?status=failure`,
          pending: `${process.env.FRONTEND_URL}/checkout/resultado?status=pending`,
        },
        auto_return: "approved",
      },
    });

    nuevaOrden.preferenceId = result.id;
    await nuevaOrden.save();

    res.status(201).json({
      mensaje: "La preferencia de pago fue creada con exito",
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      ordenId: nuevaOrden._id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Ocurrió un error al crear la preferencia de pago",
    });
  }
};

export const crearPreferenciaPagoReserva = async (req, res) => {
  try {
    const { reservaId } = req.body;
    const usuarioId = req.usuario.id;

    // Validación defensiva para evitar errores de URLs indefinidas
    if (!process.env.FRONTEND_URL || !process.env.BACKEND_URL) {
      console.error(
        "❌ Faltan variables de entorno FRONTEND_URL o BACKEND_URL",
      );
      return res.status(500).json({
        mensaje: "Error de configuración en el servidor (URLs faltantes)",
      });
    }

    const reserva = await Reserva.findById(reservaId).populate(
      "cancha",
      "nombre precio",
    );

    if (!reserva) {
      return res.status(404).json({
        mensaje: "No se encontró la reserva",
      });
    }

    if (reserva.usuario.toString() !== usuarioId) {
      return res.status(403).json({
        mensaje: "No tenés permiso para pagar esta reserva",
      });
    }

    if (reserva.estado !== "pendiente") {
      return res.status(400).json({
        mensaje: "La reserva no está pendiente de pago",
      });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: reserva.cancha._id.toString(),
            title: `Reserva ${reserva.cancha.nombre}`,
            description: `Reserva del ${reserva.fecha.toLocaleDateString(
              "es-AR",
            )} de ${reserva.horaInicio} a ${reserva.horaFin}`,
            unit_price: Number(reserva.precio),
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        external_reference: reserva._id.toString(),
        notification_url: `${process.env.BACKEND_URL}/api/pago/webhook`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/resultado-cancha?status=success`,
          failure: `${process.env.FRONTEND_URL}/checkout/resultado-cancha?status=failure`,
          pending: `${process.env.FRONTEND_URL}/checkout/resultado-cancha?status=pending`,
        },
        auto_return: "approved",
      },
    });

    reserva.preferenceId = result.id;
    await reserva.save();

    return res.status(201).json({
      mensaje: "La preferencia de pago fue creada con éxito",
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      reservaId: reserva._id,
      preferenceId: result.id,
    });
  } catch (error) {
    console.error("Error al crear preferencia de reserva:", error);

    return res.status(500).json({
      mensaje: "Ocurrió un error al crear la preferencia de pago",
      detalles: error.message,
    });
  }
};

export const recibirWebhook = async (req, res) => {
  try {
    console.log("🚨 Webhook de Mercado Pago recibido");

    const topicOrType =
      req.query.topic ||
      req.query.type ||
      req.body?.type ||
      req.body?.action;

    let paymentId =
      req.query.id ||
      req.query["data.id"] ||
      req.body?.data?.id;

    if (topicOrType === "merchant_order") {
      const merchantOrderId = req.query.id;
      const respuesta = await fetch(
        `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );
      const merchantOrder = await respuesta.json();
      const pagoAprobado = merchantOrder.payments?.find(
        (pago) => pago.status === "approved"
      );
      if (pagoAprobado) {
        paymentId = pagoAprobado.id;
      }
    }

    if (!paymentId) {
      console.log("⚠️ Webhook recibido sin paymentId");
      return res.sendStatus(200);
    }

    const payment = new Payment(client);
    const pagoData = await payment.get({ id: paymentId });

    if (pagoData.status !== "approved") {
      console.log("⏳ El pago todavía no está aprobado:", pagoData.status);
      return res.sendStatus(200);
    }

    const externalReference = pagoData.external_reference;
    const montoPagado = pagoData.transaction_amount;
    const monedaPagada = pagoData.currency_id;

    // 1️⃣ Intentar procesar como RESERVA
    const reserva = await Reserva.findById(externalReference).populate("cancha", "precio");
    
    if (reserva) {
      // 🔒 IDEMPOTENCIA: Si ya está confirmada, no procesar de nuevo
      if (reserva.estado === "confirmada") {
        console.log("ℹ️ La reserva ya estaba confirmada previamente (Idempotencia).");
        return res.sendStatus(200);
      }

      // 🛡️ VALIDACIÓN INTEGRAL: Verificar importe y moneda
      if (Number(montoPagado) !== Number(reserva.precio) || monedaPagada !== "ARS") {
        console.error("❌ Discrepancia en montos o moneda para la reserva", {
          esperado: reserva.precio,
          recibido: montoPagado,
        });
        return res.status(400).json({ error: "El monto o la moneda no coinciden con la reserva" });
      }

      reserva.estado = "confirmada";
      reserva.paymentId = paymentId;
      await reserva.save();

      console.log("✅ Reserva confirmada y trazada con éxito:", reserva._id.toString());
      return res.sendStatus(200);
    }

    // 2️⃣ Si no es reserva, intentar procesar como ORDEN (Carrito)
    const orden = await Orden.findById(externalReference);

    if (orden) {
      // 🔒 IDEMPOTENCIA: Si la orden ya está aprobada
      if (orden.estado === "aprobada") {
        console.log("ℹ️ La orden ya estaba aprobada previamente (Idempotencia).");
        return res.sendStatus(200);
      }

      // 🛡️ VALIDACIÓN INTEGRAL: Verificar importe y moneda
      if (Number(montoPagado) !== Number(orden.montoTotal) || monedaPagada !== "ARS") {
        console.error("❌ Discrepancia en montos o moneda para la orden");
        return res.status(400).json({ error: "El monto o la moneda no coinciden con la orden" });
      }

      orden.estado = "aprobada";
      orden.paymentId = paymentId;
      await orden.save();

      const carrito = await buscarOcrearCarrito(orden.usuario);
      if (carrito) {
        carrito.items = [];
        await carrito.save();
      }

      console.log("✅ Orden aprobada y carrito vaciado con éxito:", externalReference);
      return res.sendStatus(200);
    }

    console.log("⚠️ No se encontró Reserva ni Orden para external_reference:", externalReference);
    return res.sendStatus(200);

  } catch (error) {
    console.error("❌ Error crítico en Webhook:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerMisCompras = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await Orden.find({
      usuario: usuarioId,
    }).sort({ createdAt: -1 });

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