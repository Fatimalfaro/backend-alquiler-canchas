const errorMulter = (err, _req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ mensaje: "La imagen no puede superar los 2MB" });
  }
   if (err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      mensaje: "Formato de imagen no válido. Solo se permiten JPG, PNG o WEBP.",
    });
  }

  return next(err);
};

export default errorMulter;
