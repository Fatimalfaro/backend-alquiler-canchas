import Cancha from "../models/cancha.js";
import subirImagenACloudinary from "../utils/cloudinaryUploader.js";

export const agregarCanchaService = async (datos, archivo) => {
  const datosCancha = {
    ...datos,
  };

  const resultado = await subirImagenACloudinary(archivo.buffer);

  datosCancha.imagen = resultado.secure_url;

  const cancha = new Cancha(datosCancha);

  await cancha.save();

  return cancha;
};

export const listarCanchasService = async (queryParams) => {
  const { termino } = queryParams;

  const numeroPagina = parseInt(queryParams.pagina) || 1;
  const cantCanchas = parseInt(queryParams.limite) || 6;
  const salto = (numeroPagina - 1) * cantCanchas;

  const query = { activo: true };

  if (termino) {
    query.nombre = {
      $regex: termino,
      $options: "i",
    };
  }

  const [canchas, cantidadCanchas] = await Promise.all([
    Cancha.find(query).skip(salto).limit(cantCanchas),
    Cancha.countDocuments(query),
  ]);

  return {
    canchas,
    cantidadCanchas,
    pagina: numeroPagina,
    limite: cantCanchas,
  };
};

export const buscarCanchaPorIDService = async (id) => {
  const canchaBuscada = await Cancha.findById(id);

  return canchaBuscada;
};

export const borrarCanchaPorIDService = async (id) => {
  const canchaBorrada = await Cancha.findByIdAndUpdate(
    id,
    {
      activo: false,
      disponible: false,
    },
    { new: true },
  );

  return canchaBorrada;
};

export const editarCanchaPorIDService = async (id, datos, archivo) => {
  const cancha = await Cancha.findById(id);

  if (!cancha) {
    return null;
  }

  cancha.nombre = datos.nombre;
  cancha.descripcion = datos.descripcion;
  cancha.precio = datos.precio;
  cancha.tipo = datos.tipo;
  cancha.disponible = datos.disponible;

  if (archivo) {
    const resultado = await subirImagenACloudinary(archivo.buffer);

    cancha.imagen = resultado.secure_url;
  }

  await cancha.save();

  return cancha;
};
