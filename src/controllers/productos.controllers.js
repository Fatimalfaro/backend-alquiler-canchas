import Producto from "../models/producto.js";

export const agregarProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar agregar un producto' });
    }
}

export const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar listar los productos' });
    }
}

export const buscarProductoPorID = async (req, res) => {
    try {
        const productoBuscado = await Producto.findById(req.params.id);
        if (!productoBuscado) {
            return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
        }
        res.status(200).json(productoBuscado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar buscar un producto por id' });
    }
}

export const borrarProductoPorID = async (req, res) => {
    try {
        const productoBorrado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoBorrado) {
            return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
        }
        res.status(200).json({ message: 'El producto se elimino correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar borrar un producto por id' });
    }
}