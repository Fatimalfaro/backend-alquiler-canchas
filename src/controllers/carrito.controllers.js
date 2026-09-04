import Producto from "../models/producto.js";


export const agregarAlCarrito = async (req, res) => {
    try {
       const { producto, cantidad } = req.body;
       const usuarioId = req.user.id;
       
       const productoExistente = await Producto.findById(producto);
       if (!productoExistente) {
           return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
       }
       
       const carrito = buscarOcrearCarrito(usuarioId);

       const itemIndex = carrito.items.findIndex((item) => item.producto.toString() === producto);
       
       if (itemIndex > -1) {
           carrito.items[itemIndex].cantidad += cantidad;
       } else {
           carrito.items.push({ 
            producto, 
            cantidad 
        });
       }
       
    }catch(error){
        res.status(500).json({ message: 'Ocurrio un error al intentar agregar un producto al carrito'});
    }
}