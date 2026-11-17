import {
  agregarProductoService,
  listarProductosService,
  buscarProductoPorIDService,
  borrarProductoPorIDService,
  editarProductoPorIDService,
} from "../services/producto.service.js";

// AGREGAR PRODUCTO
export const agregarProducto = async (req, res) => {
  try {
    const producto = await agregarProductoService(req.body, req.file);

    if (!producto) {
      return res.status(409).json({
        message: "No se puede agregar un producto con el mismo nombre.",
      });
    }

    res.status(201).json({
      message: "Producto agregado exitosamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar agregar un producto",
    });
  }
};

// LISTAR PRODUCTOS
export const listarProductos = async (req, res) => {
  try {
    const resultado = await listarProductosService(req.query);

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrio un error al intentar listar los productos" });
  }
};

// BUSCAR PRODUCTO POR ID
export const buscarProductoPorID = async (req, res) => {
  try {
    const productoBuscado = await buscarProductoPorIDService(req.params.id);

    if (!productoBuscado) {
      return res
        .status(404)
        .json({ message: "No se encontro un producto con el ID enviado" });
    }

    res.status(200).json(productoBuscado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ocurrio un error al intentar buscar un producto por id",
    });
  }
};

// BORRAR PRODUCTO POR ID
export const borrarProductoPorID = async (req, res) => {
  try {
    const productoBorrado = await borrarProductoPorIDService(req.params.id);

    if (!productoBorrado) {
      return res
        .status(404)
        .json({ message: "No se encontro un producto con el ID enviado" });
    }

    res.status(200).json({ message: "El producto se elimino correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ocurrio un error al intentar borrar un producto por id",
    });
  }
};

// EDITAR PRODUCTO POR ID
export const editarProductoPorID = async (req, res) => {
  try {
    const productoEditado = await editarProductoPorIDService(
      req.params.id,
      req.body,
      req.file,
    );

    if (!productoEditado) {
      return res
        .status(404)
        .json({ message: "No se encontro un producto con el ID enviado" });
    }

    res.status(200).json({
      message: "El producto se actualizo correctamente",
      producto: productoEditado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ocurrio un error al intentar editar un producto por id",
    });
  }
};
