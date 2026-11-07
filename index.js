import Server from "./src/server/config.js";

const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Error crítico: Falta la variable de entorno ${env}`);
    process.exit(1);
  }
});

const server = new Server();

server.listen();
