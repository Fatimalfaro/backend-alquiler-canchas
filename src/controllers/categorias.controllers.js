import Categoria from "../models/categoria.js";

export const crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    await nuevaCategoria.save();
    res.status(201).json({ message: "Categoria creada exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrio un error al intentar crear una categoria" });
  }
};
export const listarCategorias = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    
    const limit = parseInt(req.query.limit) || 6; 
    
    const skip = (page - 1) * limit;

    const [categorias, totalCategorias] = await Promise.all([
      Categoria.find({ activo: true }).skip(skip).limit(limit),
      Categoria.countDocuments({ activo: true })
    ]);

    const totalPages = Math.ceil(totalCategorias / limit);

    res.status(200).json({
      categorias,
      paginacion: {
        totalItems: totalCategorias,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al intentar listar las categorías" });
  }
};


export const buscarCategoriaPorID = async (req, res) => {
  try {
    const categoriaBuscada = await Categoria.findById(req.params.id);
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

export const borrarCategoriaPorID = async (req, res) => {
  try {
    const categoriaBorrada = await Categoria.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true },
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

export const editarCategoriaPorID = async (req, res) => {
  try {
    const categoriaEditada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
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
