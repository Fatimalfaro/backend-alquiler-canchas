import Cancha from "../models/cancha.js";
import subirImagenACloudinary from "../utils/cloudinaryUploader.js";

export const agregarCancha = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "La imagen de la cancha es obligatoria",
      });
    }

    const datosCancha = {
      ...req.body,
    };

    const resultado = await subirImagenACloudinary(req.file.buffer);

    datosCancha.imagen = resultado.secure_url;

    const cancha = new Cancha(datosCancha);

    await cancha.save();

    res.status(201).json({
      message: "Cancha agregada exitosamente",
      cancha,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar agregar una cancha",
    });
  }
};

export const listarCanchas = async (req, res) => {
  try {
    const { termino} = req.query;

    const numeroPagina = parseInt(req.query.pagina)||1;
    const cantCanchas = parseInt(req.query.limite)||8;
    const salto = (numeroPagina - 1) * cantCanchas;

    const query = {};

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

    res.status(200).json({
      canchas,
      cantidadCanchas,
      pagina: numeroPagina,
      limite: cantCanchas,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar listar las canchas",
    });
  }
};

export const buscarCanchaPorID = async (req, res) => {
  try {
    const canchaBuscada = await Cancha.findById(req.params.id);

    if (!canchaBuscada) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

    res.status(200).json(canchaBuscada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar buscar una cancha por ID",
    });
  }
};

export const borrarCanchaPorID = async (req, res) => {
  try {
    const canchaBorrada = await Cancha.findByIdAndDelete(req.params.id);

    if (!canchaBorrada) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

    res.status(200).json({
      message: "La cancha se eliminó correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar borrar una cancha por ID",
    });
  }
};

export const editarCanchaPorID = async (req, res) => {
  try {
    const cancha = await Cancha.findById(req.params.id);

    if (!cancha) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

    // Actualizamos los campos enviados
    cancha.nombre = req.body.nombre;
    cancha.descripcion = req.body.descripcion;
    cancha.precio = req.body.precio;
    cancha.tipo = req.body.tipo;
    cancha.disponible = req.body.disponible;

    // Si se seleccionó una nueva imagen, la subimos a Cloudinary
    if (req.file) {
      const resultado = await subirImagenACloudinary(req.file.buffer);

      cancha.imagen = resultado.secure_url;
    }

    await cancha.save();

    res.status(200).json({
      message: "La cancha se actualizó correctamente",
      cancha,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar editar una cancha por ID",
    });
  }
};
