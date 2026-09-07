import {MercadoPagoConfig} from "mercadopago";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";

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
                quality: Number(item.cantidad),
                currency_id: "ARS",
                picture_url: item.producto.imagen
            }
        }

    
    )





        res.status(201).json(carrito)

    }catch(error){
        console.error(error);
        res.status(500).json({mensaje:'Ocurrió un error al crear la preferencia de pago'})
    }
}