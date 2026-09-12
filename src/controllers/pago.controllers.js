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
          success: `${process.env.FRONTEND_URL}/checkout/resultado?status=sucess`,
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
        
          success: `${process.env.FRONTEND_URL}/checkout/resultado?status=success`,
          failure: `${process.env.FRONTEND_URL}/checkout/resultado?status=failure`,
          pending: `${process.env.FRONTEND_URL}/checkout/resultado?status=pending`,
        },
        auto_return: "approved",
      },
    });

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
    console.log("Query params:", req.query);
    console.log("Body payload:", req.body);

    const paymentId =
      req.query.id || req.query["data.id"] || req.body?.data?.id;

    const topicOrType =
      req.query.topic || req.query.type || req.body?.type || req.body?.action;

    if (
      (topicOrType === "payment" ||
        topicOrType === "payment.created" ||
        topicOrType === "payment.updated") &&
      paymentId
    ) {
      const payment = new Payment(client);

      const pagoData = await payment.get({
        id: paymentId,
      });

      console.log("💳 Estado del pago:", pagoData.status);
      console.log("🔎 External reference:", pagoData.external_reference);

      if (pagoData.status === "approved") {
        const externalReference = pagoData.external_reference;

        // -----------------------------------------
        // 1. BUSCAR SI ES UNA ORDEN DE PRODUCTOS
        // -----------------------------------------

        const ordenActualizada = await Orden.findByIdAndUpdate(
          externalReference,
          {
            estado: "aprobada",
            paymentId: paymentId,
          },
          { new: true },
        );

        if (ordenActualizada) {
          const carrito = await buscarOcrearCarrito(ordenActualizada.usuario);

          carrito.items = [];

          await carrito.save();

          console.log("✅ Pago aprobado para la Orden:", ordenActualizada._id);

          return res.sendStatus(200);
        }

        // -----------------------------------------
        // 2. SI NO ES ORDEN, BUSCAR RESERVA
        // -----------------------------------------

        const reservaActualizada = await Reserva.findByIdAndUpdate(
          externalReference,
          {
            estado: "confirmada",
          },
          { new: true },
        );

        if (reservaActualizada) {
          console.log(
            "⚽ Pago aprobado para la Reserva:",
            reservaActualizada._id,
          );

          return res.sendStatus(200);
        }

        console.log(
          "⚠️ No se encontró Orden ni Reserva para:",
          externalReference,
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en Webhook:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
};
