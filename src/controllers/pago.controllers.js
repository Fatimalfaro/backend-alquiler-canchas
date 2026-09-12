import {MercadoPagoConfig, Preference, Payment} from "mercadopago";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";
import Orden from "../models/orden.js";

const client = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN});

export const crearPreferenciaPago = async(req,res)=>{
    try{
        const userId = req.usuario.id;
        const carrito = await buscarOcrearCarrito(userId)
        await carrito.populate('items.producto')

        if(carrito.items.length === 0){
            return res.status(400).json({mensaje: 'El carrito esta vacio'})
        }

        let montoTotal = 0

        const itemsMP = carrito.items.map((item)=>{
            const subTotal = item.producto.precio * item.cantidad;
            montoTotal += subTotal;

            return{
                id: item.producto._id.toString(),
                title: item.producto.nombreProducto,
                unit_price: Number(item.producto.precio),
                quantity: Number(item.cantidad),
                currency_id: "ARS",
                picture_url: item.producto.imagen
            };
        }
    );

            const itemsOrden = carrito.items.map((item)=>({
                producto: item.producto._id,
                nombreProducto: item.producto.nombreProducto,
                precioUnitario: item.producto.precio,
                cantidad: item.cantidad
            }));
             
            const nuevaOrden = new Orden({
                usuario: userId,
                items: itemsOrden,
                montoTotal,
                estado: 'pendiente'
            })

            await nuevaOrden.save()

            const preference = new Preference(client)

            const result = await preference.create({
                body:{
                    items: itemsMP,
                    external_reference: nuevaOrden._id.toString(),
                    notification_url: `${process.env.BACKEND_URL}/api/pago/webhook`,
                    back_urls:{
                        success:`${process.env.FRONTEND_URL}/checkout/resultado?status=sucess`,
                        failure:`${process.env.FRONTEND_URL}/checkout/resultado?status=failure`,
                        pending:`${process.env.FRONTEND_URL}/checkout/resultado?status=pending`
                    },
                    auto_return: "approved"
                }
            })

            nuevaOrden.preferenceId = result.id
            await nuevaOrden.save()

        res.status(201).json({
            mensaje: 'La preferencia de pago fue creada con exito',
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
            ordenId: nuevaOrden._id
        }
        )

    }catch(error){
        console.error(error);
        res.status(500).json({mensaje:'Ocurrió un error al crear la preferencia de pago'})
    }
}

export const recibirWebhook = async (req, res) => {
  try {
    console.log("🚨 CUIDADO: El Webhook se está ejecutando!");
    console.log("Query params:", req.query);
    console.log("Body payload:", req.body);

    const paymentId = 
      req.query.id || 
      req.query["data.id"] || 
      req.body?.data?.id;

    const topicOrType = 
      req.query.topic || 
      req.query.type || 
      req.body?.type || 
      req.body?.action;

    if ((topicOrType === "payment" || topicOrType === "payment.created" || topicOrType === "payment.updated") && paymentId) {
      
      const payment = new Payment(client);
      const pagoData = await payment.get({ id: paymentId });

      if (pagoData.status === "approved") {
        const ordenActualizada = await Orden.findByIdAndUpdate(
          pagoData.external_reference,
          {
            estado: "aprobada",
            paymentId: paymentId,
          },
          { new: true }
        );

        if (ordenActualizada) {
          const carrito = await buscarOcrearCarrito(ordenActualizada.usuario);
          carrito.items = [];
          await carrito.save();
          console.log("🛒 Carrito vaciado con éxito para el usuario:", ordenActualizada.usuario);
        }

        console.log("✅ Pago aprobado para la Orden:", pagoData.external_reference);
      }
    }
    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Error en Webhook:", error.message);
    res.status(500).json({ error: error.message });
  }
};