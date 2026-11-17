import {
  crearCategoriaService,
  listarCategoriasService,
  buscarCategoriaPorIDService,
  borrarCategoriaPorIDService,
  editarCategoriaPorIDService,
  listarTodasLasCategoriasService,
} from "../services/categoria.service.js";

// CREAR CATEGORIA
export const crearCategoria = async (req, res, next) => {
  try {
    await crearCategoriaService(req.body);

    return res.status(201).json({
      message: "Categoria creada exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

// LISTAR CATEGORIAS
export const listarCategorias = async (req, res, next) => {
  try {
    const resultado = await listarCategoriasService(req.query);

    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

// BUSCAR CATEGORIA POR ID
export const buscarCategoriaPorID = async (req, res, next) => {
  try {
    const categoriaBuscada = await buscarCategoriaPorIDService(
      req.params.id
    );

    if (!categoriaBuscada) {
      const error = new Error("Categoria no encontrada");
      error.statusCode = 404;
      error.payload = {
        message: "Categoria no encontrada",
      };

      return next(error);
    }

    return res.status(200).json(categoriaBuscada);
  } catch (error) {
    return next(error);
  }
};

// BORRAR CATEGORIA POR ID
export const borrarCategoriaPorID = async (req, res, next) => {
  try {
    const categoriaBorrada = await borrarCategoriaPorIDService(
      req.params.id
    );

    if (!categoriaBorrada) {
      const error = new Error("Categoría no encontrada");
      error.statusCode = 404;
      error.payload = {
        message: "Categoría no encontrada",
      };

      return next(error);
    }

    return res.status(200).json({
      message: "Categoría eliminada exitosamente (borrado lógico)",
    });
  } catch (error) {
    return next(error);
  }
};

// EDITAR CATEGORIA POR ID
export const editarCategoriaPorID = async (req, res, next) => {
  try {
    const categoriaEditada = await editarCategoriaPorIDService(
      req.params.id,
      req.body
    );

    if (!categoriaEditada) {
      const error = new Error("Categoria no encontrada");
      error.statusCode = 404;
      error.payload = {
        message: "Categoria no encontrada",
      };

      return next(error);
    }

    return res.status(200).json(categoriaEditada);
  } catch (error) {
    return next(error);
  }
};


// LISTAR TODAS LAS CATEGORÍAS
export const listarTodasLasCategorias = async (req, res, next) => {
  try {
    const categorias = await listarTodasLasCategoriasService();
    return res.status(200).json({ categorias });
  } catch (error) {
    return next(error);
  }
};