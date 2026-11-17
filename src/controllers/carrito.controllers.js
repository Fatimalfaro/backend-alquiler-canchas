import {
  agregarAlCarritoService,
  obtenerCarritoService,
  vaciarCarritoService,
  restarCantidadProductoService,
  eliminarProductoCarritoService,
} from "../services/carrito.service.js";

// AGREGAR AL CARRITO
export const agregarAlCarrito = async (req, res) => {
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
    console.log("Error", error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar agregar un producto al carrito",
    });
  }
};

// OBTENER CARRITO
export const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const carrito = await obtenerCarritoService(usuarioId);

    res.status(200).json(carrito);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar obtener el carrito" });
  }
};

// VACIAR CARRITO
export const vaciarCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    await vaciarCarritoService(usuarioId);

    res.status(200).json({ mensaje: "Carrito vaciado exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar vaciar el carrito" });
  }
};

// RESTAR CANTIDAD DE PRODUCTO
export const restarCantidadProducto = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      mensaje:
        "Ocurrio un error al intentar restar la cantidad de un producto del carrito",
    });
  }
};

// ELIMINAR PRODUCTO DEL CARRITO
export const eliminarProductoCarrito = async (req, res) => {
  try {
    const { productoId } = req.params;
    const usuarioId = req.usuario.id;

    await eliminarProductoCarritoService(usuarioId, productoId);

    res
      .status(200)
      .json({ mensaje: "Producto eliminado del carrito exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar eliminar un producto del carrito",
    });
  }
};
