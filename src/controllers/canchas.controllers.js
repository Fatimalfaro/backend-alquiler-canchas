import {
  agregarCanchaService,
  listarCanchasService,
  buscarCanchaPorIDService,
  borrarCanchaPorIDService,
  editarCanchaPorIDService,
} from "../services/cancha.service.js";

// AGREGAR CANCHA
export const agregarCancha = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "La imagen de la cancha es obligatoria",
      });
    }

    const cancha = await agregarCanchaService(req.body, req.file);

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

// LISTAR CANCHAS
export const listarCanchas = async (req, res) => {
  try {
    const resultado = await listarCanchasService(req.query);

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar listar las canchas",
    });
  }
};

// BUSCAR CANCHA POR ID
export const buscarCanchaPorID = async (req, res) => {
  try {
    const canchaBuscada = await buscarCanchaPorIDService(req.params.id);

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

// BORRAR CANCHA POR ID
export const borrarCanchaPorID = async (req, res) => {
  try {
    const canchaBorrada = await borrarCanchaPorIDService(req.params.id);

    if (!canchaBorrada) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

    res.status(200).json({
      message: "La cancha se eliminó correctamente de forma lógica",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ocurrió un error al intentar borrar una cancha por ID",
    });
  }
};

// EDITAR CANCHA POR ID
export const editarCanchaPorID = async (req, res) => {
  try {
    const cancha = await editarCanchaPorIDService(
      req.params.id,
      req.body,
      req.file,
    );

    if (!cancha) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

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
