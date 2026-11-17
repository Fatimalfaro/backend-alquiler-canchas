
import {
  crearCategoriaService,
  listarCategoriasService,
  buscarCategoriaPorIDService,
  borrarCategoriaPorIDService,
  editarCategoriaPorIDService,
} from "../services/categoria.service.js";

// CREAR CATEGORIA
export const crearCategoria = async (req, res) => {
  try {
    await crearCategoriaService(req.body);

    res.status(201).json({ message: "Categoria creada exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrio un error al intentar crear una categoria" });
  }
};

// LISTAR CATEGORIAS
export const listarCategorias = async (req, res) => {
  try {
    const resultado = await listarCategoriasService(req.query);

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al intentar listar las categorías" });
  }
};

// BUSCAR CATEGORIA POR ID
export const buscarCategoriaPorID = async (req, res) => {
  try {
    const categoriaBuscada = await buscarCategoriaPorIDService(
      req.params.id,
    );

    if (!categoriaBuscada) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    res.status(200).json(categoriaBuscada);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrio un error al intentar buscar la categoria" });
  }
};

// BORRAR CATEGORIA POR ID
export const borrarCategoriaPorID = async (req, res) => {
  try {
    const categoriaBorrada = await borrarCategoriaPorIDService(
      req.params.id,
    );

    if (!categoriaBorrada) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res
      .status(200)
      .json({ message: "Categoría eliminada exitosamente (borrado lógico)" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al intentar eliminar la categoría" });
  }
};

// EDITAR CATEGORIA POR ID
export const editarCategoriaPorID = async (req, res) => {
  try {
    const categoriaEditada = await editarCategoriaPorIDService(
      req.params.id,
      req.body,
    );

    if (!categoriaEditada) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    res.status(200).json(categoriaEditada);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrio un error al intentar editar la categoria" });
  }
};
