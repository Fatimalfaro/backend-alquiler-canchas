
export const verificarRol = (rolRequerido) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No estás autenticado",
      });
    }

    if (req.usuario.rol !== rolRequerido) {
      return res.status(403).json({
        mensaje: "No tenés permisos para realizar esta acción",
      });
    }

    next();
  };
};

