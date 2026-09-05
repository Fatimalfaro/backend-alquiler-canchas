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

export const obtenerCarrito = async (req, res) => {
    try{
        const usuarioId = req.usuario.id;
        const carrito = await buscarOcrearCarrito(usuarioId);
        
        await carrito.populate("items.producto", "nombreProducto precio imagen");
        
        res.status(200).json(carrito);

    }catch(error){
        console.error(error);
        res.status(500).json({ mensaje: 'Ocurrio un error al intentar obtener el carrito'});
    }
}

export const vaciarCarrito = async (req, res) => {
    try{
        const usuarioId = req.usuario.id;
        const carrito = await buscarOcrearCarrito(usuarioId);
        carrito.items = [];
        await carrito.save();
        res.status(200).json({ mensaje: 'Carrito vaciado exitosamente' });
    }catch(error){
        console.error(error);
        res.status(500).json({ mensaje: 'Ocurrio un error al intentar vaciar el carrito'});
    }
}

export const restarCantidadProducto = async (req, res) => {
    try {
        const usuarioId = req.usuario.id
        const { productoId } = req.params

        const carrito = await buscarOcrearCarrito(usuarioId);
        const itemIndex = carrito.items.findIndex((item) => item.producto.toString() === productoId);

        if (itemIndex === -1) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
        } 
        
        carrito.items[itemIndex].cantidad -= 1
        
        if(carrito.items[itemIndex].cantidad <= 0){
        carrito.items.splice(itemIndex, 1)
       }

      await carrito.save() 
      await carrito.populate('items.producto', 'nombreProducto precio imagen')
      res.status(200).json({mensaje: 'Cantidad actualizada correctamente', carrito})

    }catch(error){
        console.error(error);
        res.status(500).json({ mensaje: 'Ocurrio un error al intentar restar la cantidad de un producto del carrito'});
    }
}
