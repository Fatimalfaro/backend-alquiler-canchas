import {Router} from 'express';
import { agregarAlCarrito, obtenerCarrito, vaciarCarrito } from '../controllers/carrito.controllers.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/').post(verificarToken, agregarAlCarrito).get(verificarToken, obtenerCarrito).delete(verificarToken, vaciarCarrito);

export default router;