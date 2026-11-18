import Categoria from "../models/categoria.js";

export const crearCategoriaService = async (datos) => {
  const nuevaCategoria = new Categoria(datos);
  await nuevaCategoria.save();

  return nuevaCategoria;
};

export const listarCategoriasService = async (queryParams) => {
  const page = parseInt(queryParams.page) || 1;

  const limit = parseInt(queryParams.limit) || 6;

  const skip = (page - 1) * limit;

  const [categorias, totalCategorias] = await Promise.all([
    Categoria.find({ activo: true }).skip(skip).limit(limit),
    Categoria.countDocuments({ activo: true }),
  ]);

  const totalPages = Math.ceil(totalCategorias / limit);

  return {
    categorias,
    paginacion: {
      totalItems: totalCategorias,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const buscarCategoriaPorIDService = async (id) => {
  const categoriaBuscada = await Categoria.findById(id);

  return categoriaBuscada;
};

export const borrarCategoriaPorIDService = async (id) => {
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { activo: false },
    { new: true },
  );

  return categoriaBorrada;
};

export const editarCategoriaPorIDService = async (id, datos) => {
  const categoriaEditada = await Categoria.findByIdAndUpdate(
    id,
    datos,
    { new: true },
  );

  return categoriaEditada;
};

export const listarTodasLasCategoriasService = async () => {
  return await Categoria.find({ activo: true });
};