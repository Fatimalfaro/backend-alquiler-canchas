import Cancha from "../models/cancha.js";

export const agregarCancha = async (req, res) => {
  try {
    const cancha = new Cancha(req.body);

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
    const { termino, pagina, limite } = req.query;

    const numeroPagina = parseInt(pagina);
    const cantCanchas = parseInt(limite);
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
    const canchaEditada = await Cancha.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!canchaEditada) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

    res.status(200).json({
      message: "La cancha se actualizó correctamente",
      cancha: canchaEditada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar editar una cancha por ID",
    });
  }
};
