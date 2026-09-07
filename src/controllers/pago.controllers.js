import {MercadoPagoConfig} from "mercadopago";

const client = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN});



export const crearPreferenciaPago = async(req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({mensaje:'Ocurrió un error al crear la preferencia de pago'})
    }
}