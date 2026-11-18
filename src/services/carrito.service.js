import Producto from "../models/producto.js";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";

export const agregarAlCarritoService = async (datos, usuarioId) => {
  const { producto, cantidad } = datos;

  const productoExistente = await Producto.findById(producto);

  if (!productoExistente) {
    return null;
  }

  const carrito = await buscarOcrearCarrito(usuarioId);

  const itemIndex = carrito.items.findIndex(
    (item) => item.producto.toString() === producto,
  );

  if (itemIndex > -1) {
    carrito.items[itemIndex].cantidad += cantidad;
  } else {
    carrito.items.push({
      producto,
      cantidad,
    });
  }

  await carrito.save();

  await carrito.populate(
    "items.producto",
    "nombreProducto precio imagen descripcion",
  );

  return carrito;
};

export const obtenerCarritoService = async (usuarioId) => {
  const carrito = await buscarOcrearCarrito(usuarioId);

  await carrito.populate(
    "items.producto",
    "nombreProducto precio imagen descripcion",
  );

  return carrito;
};

export const vaciarCarritoService = async (usuarioId) => {
  const carrito = await buscarOcrearCarrito(usuarioId);

  carrito.items = [];

  await carrito.save();

  return carrito;
};

export const restarCantidadProductoService = async (usuarioId, productoId) => {
  const carrito = await buscarOcrearCarrito(usuarioId);

  const itemIndex = carrito.items.findIndex(
    (item) => item.producto.toString() === productoId,
  );

  if (itemIndex === -1) {
    return null;
  }

  carrito.items[itemIndex].cantidad -= 1;

  if (carrito.items[itemIndex].cantidad <= 0) {
    carrito.items.splice(itemIndex, 1);
  }

  await carrito.save();

  await carrito.populate(
    "items.producto",
    "nombreProducto precio imagen descripcion",
  );

  return carrito;
};

export const eliminarProductoCarritoService = async (usuarioId, productoId) => {
  const carrito = await buscarOcrearCarrito(usuarioId);

  carrito.items = carrito.items.filter(
    (item) => item.producto.toString() !== productoId,
  );

  await carrito.save();

  await carrito.populate(
    "items.producto",
    "nombreProducto precio imagen descripcion",
  );

  return carrito;
};
