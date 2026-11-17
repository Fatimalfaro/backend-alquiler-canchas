import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      error.code = "INVALID_FILE_TYPE";
      cb(error);
    }
  },
});

export default upload;
