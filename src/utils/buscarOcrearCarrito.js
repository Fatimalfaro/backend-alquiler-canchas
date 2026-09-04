import Carrito from "../models/carrito.js";

const buscarOcrearCarrito = async (usuarioId) => {
    try {
        let carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            carrito = await Carrito.create({
                usuario: usuarioId,
                items: []
            }
            );
        }
        return carrito;
    } catch (error) {
        console.error(error);
    }
}

export default buscarOcrearCarrito