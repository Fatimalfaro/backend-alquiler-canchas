import {
  agregarCanchaService,
  listarCanchasService,
  buscarCanchaPorIDService,
  borrarCanchaPorIDService,
  editarCanchaPorIDService,
} from "../services/cancha.service.js";

export const agregarCancha = async (req, res, next) => {
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
    return next(error);
  }
};

export const listarCanchas = async (req, res, next) => {
  try {
    const resultado = await listarCanchasService(req.query);

    res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};
  
export const buscarCanchaPorID = async (req, res, next) => {
  try {
    const canchaBuscada = await buscarCanchaPorIDService(req.params.id);

    if (!canchaBuscada) {
      return res.status(404).json({
        message: "No se encontró una cancha con el ID enviado",
      });
    }

    res.status(200).json(canchaBuscada);
  } catch (error) {
    return next(error);
  }
};

export const borrarCanchaPorID = async (req, res, next) => {
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
    return next(error);
  }
};

export const editarCanchaPorID = async (req, res, next) => {
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
    return next(error);
  }
};
