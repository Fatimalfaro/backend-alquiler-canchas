import Producto from "../models/producto.js";
import subirImagenACloudinary from "../utils/cloudinaryUploader.js";

export const agregarProductoService = async (datos, archivo) => {
  const productoExistente = await Producto.findOne({
    nombreProducto: datos.nombreProducto.trim(),
  });

  if (productoExistente) {
    return null;
  }

  let imagenUrl = "";

  if (archivo) {
    const resultado = await subirImagenACloudinary(archivo.buffer);
    imagenUrl = resultado.secure_url;
  } else {
    imagenUrl =
      "https://images.pexels.com/photos/9853347/pexels-photo-9853347.jpeg";
  }

  const nuevoProductoData = {
    ...datos,
    nombreProducto: datos.nombreProducto.trim(),
    imagen: imagenUrl,
  };

  const producto = new Producto(nuevoProductoData);

  await producto.save();

  return producto;
};

export const listarProductosService = async (queryParams) => {
  const { termino, pagina, limite } = queryParams;
  const numeroPagina = parseInt(pagina);
  const cantProductos = parseInt(limite);
  const salto = (numeroPagina - 1) * cantProductos;

  const query = {};

  if (termino) {
    query.nombreProducto = { $regex: termino, $options: "i" };
  }

  const [productos, cantidadProductos] = await Promise.all([
    Producto.find(query)
      .populate("categoria", "nombreCategoria")
      .skip(salto)
      .limit(cantProductos),
    Producto.countDocuments(query),
  ]);

  return { productos, cantidadProductos };
};

export const buscarProductoPorIDService = async (id) => {
  const productoBuscado = await Producto.findById(id);
  return productoBuscado;
};

export const borrarProductoPorIDService = async (id) => {
  const productoBorrado = await Producto.findByIdAndDelete(id);
  return productoBorrado;
};

export const editarProductoPorIDService = async (id, datos, archivo) => {
  const productoExistente = await Producto.findById(id);

  if (!productoExistente) {
    return null;
  }

  let imagenUrl = productoExistente.imagen;

  if (archivo) {
    const resultado = await subirImagenACloudinary(archivo.buffer);
    imagenUrl = resultado.secure_url;
  }

  const datosActualizados = {
    ...datos,
    imagen: imagenUrl,
  };

  const productoEditado = await Producto.findByIdAndUpdate(
    id,
    datosActualizados,
    { new: true },
  );

  return productoEditado;
};
