import {
  agregarProductoService,
  listarProductosService,
  buscarProductoPorIDService,
  borrarProductoPorIDService,
  editarProductoPorIDService,
} from "../services/producto.service.js";

const enviarError = (next, statusCode, mensaje) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  error.payload = { message: mensaje };
  return next(error);
};

export const agregarProducto = async (req, res, next) => {
  try {
    const producto = await agregarProductoService(req.body, req.file);

    if (!producto) {
      return enviarError(
        next,
        409,
        "No se puede agregar un producto con el mismo nombre.",
      );
    }

    return res.status(201).json({
      message: "Producto agregado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

export const listarProductos = async (req, res, next) => {
  try {
    const resultado = await listarProductosService(req.query);

    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const buscarProductoPorID = async (req, res, next) => {
  try {
    const productoBuscado = await buscarProductoPorIDService(req.params.id);

    if (!productoBuscado) {
      return enviarError(
        next,
        404,
        "No se encontro un producto con el ID enviado",
      );
    }

    return res.status(200).json(productoBuscado);
  } catch (error) {
    return next(error);
  }
};

export const borrarProductoPorID = async (req, res, next) => {
  try {
    const productoBorrado = await borrarProductoPorIDService(req.params.id);

    if (!productoBorrado) {
      return enviarError(
        next,
        404,
        "No se encontro un producto con el ID enviado",
      );
    }

    return res.status(200).json({
      message: "El producto se elimino correctamente",
    });
  } catch (error) {
    return next(error);
  }
};

export const editarProductoPorID = async (req, res, next) => {
  try {
    const productoEditado = await editarProductoPorIDService(
      req.params.id,
      req.body,
      req.file,
    );

    if (!productoEditado) {
      return enviarError(
        next,
        404,
        "No se encontro un producto con el ID enviado",
      );
    }

    return res.status(200).json({
      message: "El producto se actualizo correctamente",
      producto: productoEditado,
    });
  } catch (error) {
    return next(error);
  }
};
