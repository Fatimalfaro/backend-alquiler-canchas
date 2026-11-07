import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.info("Base de datos conectada exitosamente");
  } catch (error) {
    console.error("Error crítico al conectar a MongoDB:", error.message);
    process.exit(1); // Esto detiene la app inmediatamente si falla
  }
};

connectDB();
