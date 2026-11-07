import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "../database/db.js"; // Se ejecuta y valida la conexión (y frena si falla)
import rutas from "../routes/index.routes.js";

export default class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
      }),
    );

    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());

    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.app.use(express.static(__dirname + "/../../public"));
  }

  routes() {
    // Único punto de montaje para /api, evitando duplicados
    this.app.use("/api", rutas);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.info(`Servidor activo en el puerto ${this.PORT}`);
    });
  }
}
