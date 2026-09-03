import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});
export const enviarCodigoVerificacion = async (email, codigo) => {
  await transporter.sendMail({
    from: '"Alquiler de Canchas" <no-reply@alquiler-canchas.com>',
    to: email,
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${codigo}. Este código tiene una validez de 10 minutos.`,
    html: `
      <h2>Verificación de cuenta</h2>
      <p>Gracias por registrarte en Alquiler de Canchas.</p>
      <p>Tu código de verificación es:</p>
      <h1>${codigo}</h1>
      <p>Este código tiene una validez de 10 minutos.</p>
    `,
  });
}
