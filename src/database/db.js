import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.info("Conexion a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
};

conectarDB();