import Categoria from "../models/categoria.js";

// CREAR CATEGORIA
export const crearCategoriaService = async (datos) => {
  const nuevaCategoria = new Categoria(datos);
  await nuevaCategoria.save();

  return nuevaCategoria;
};

// LISTAR CATEGORIAS
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

// BUSCAR CATEGORIA POR ID
export const buscarCategoriaPorIDService = async (id) => {
  const categoriaBuscada = await Categoria.findById(id);

  return categoriaBuscada;
};

// BORRAR CATEGORIA POR ID
export const borrarCategoriaPorIDService = async (id) => {
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { activo: false },
    { new: true },
  );

  return categoriaBorrada;
};

// EDITAR CATEGORIA POR ID
export const editarCategoriaPorIDService = async (id, datos) => {
  const categoriaEditada = await Categoria.findByIdAndUpdate(
    id,
    datos,
    { new: true },
  );

  return categoriaEditada;
};

// LISTAR TODAS LAS CATEGORÍAS ACTIVAS
export const listarTodasLasCategoriasService = async () => {
  return await Categoria.find({ activo: true });
};