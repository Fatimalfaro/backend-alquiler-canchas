import {MercadoPagoConfig} from "mercadopago";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";
import Orden from "../models/orden.js";

const client = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN});

export const crearPreferenciaPago = async(req,res)=>{
    try{
        const userId = req.user.id;
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
                producto: item.servicio._id,
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


        res.status(201).json(carrito)

    }catch(error){
        console.error(error);
        res.status(500).json({mensaje:'Ocurrió un error al crear la preferencia de pago'})
    }
}