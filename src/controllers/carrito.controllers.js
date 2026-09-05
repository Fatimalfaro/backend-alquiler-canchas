import Producto from "../models/producto.js";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";


export const agregarAlCarrito = async (req, res) => {
    try {
       const { producto, cantidad } = req.body;
       const usuarioId = req.usuario.id;
       
       const productoExistente = await Producto.findById(producto);
       if (!productoExistente) {
           return res.status(404).json({ mensaje: 'No se encontro un producto con el ID enviado' });
       }
       
       const carrito = await buscarOcrearCarrito(usuarioId);

       const itemIndex = carrito.items.findIndex((item) => item.producto.toString() === producto);
       
       if (itemIndex > -1) {
           carrito.items[itemIndex].cantidad += cantidad;
       } else {
           carrito.items.push({ 
            producto, 
            cantidad 
        });
       }
       await carrito.save();
       await carrito.populate("items.producto", "nombreProducto precio imagen");
       res.status(200).json({ mensaje: 'Producto agregado al carrito exitosamente', carrito });

    }catch(error){
        res.status(500).json({ mensaje: 'Ocurrio un error al intentar agregar un producto al carrito'});
    }
}