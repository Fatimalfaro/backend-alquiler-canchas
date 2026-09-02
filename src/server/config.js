import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import '../database/db.js'
import rutas from "../routes/index.routes.js";

export default class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
    this.middlewares();
    
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan("dev"))
    this.app.use("/api", rutas);

    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.app.use(express.static(__dirname + "/../../public"));
    
  }

  listen(){
    this.app.listen(this.PORT, () => {
      console.info(`Servidor activo en http://localhost:${this.PORT}`);
    });
  }
}