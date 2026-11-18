import {
  agregarAlCarritoService,
  obtenerCarritoService,
  vaciarCarritoService,
  restarCantidadProductoService,
  eliminarProductoCarritoService,
} from "../services/carrito.service.js";

export const agregarAlCarrito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const carrito = await agregarAlCarritoService(req.body, usuarioId);

    if (!carrito) {
      return res
        .status(404)
        .json({ mensaje: "No se encontro un producto con el ID enviado" });
    }

    res
      .status(200)
      .json({ mensaje: "Producto agregado al carrito exitosamente", carrito });
  } catch (error) {
    return next(error);
    }
  };

export const obtenerCarrito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const carrito = await obtenerCarritoService(usuarioId);

    res.status(200).json(carrito);
  } catch (error) {
    return next(error);
  }
};

export const vaciarCarrito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    await vaciarCarritoService(usuarioId);

    res.status(200).json({ mensaje: "Carrito vaciado exitosamente" });
  } catch (error) {
    return next(error);
  }
};

export const restarCantidadProducto = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const { productoId } = req.params;

    const carrito = await restarCantidadProductoService(usuarioId, productoId);

    if (!carrito) {
      return res
        .status(404)
        .json({ mensaje: "Producto no encontrado en el carrito" });
    }

    res
      .status(200)
      .json({ mensaje: "Cantidad actualizada correctamente", carrito });
  } catch (error) {
    return next(error);
  }
};

export const eliminarProductoCarrito = async (req, res, next) => {
  try {
    const { productoId } = req.params;
    const usuarioId = req.usuario.id;

    await eliminarProductoCarritoService(usuarioId, productoId);

    res
      .status(200)
      .json({ mensaje: "Producto eliminado del carrito exitosamente" });
  } catch (error) {
    return next(error);
  }
};
