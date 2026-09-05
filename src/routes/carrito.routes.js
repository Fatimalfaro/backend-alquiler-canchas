import {Router} from 'express';
import { agregarAlCarrito, obtenerCarrito } from '../controllers/carrito.controllers.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/').post(verificarToken, agregarAlCarrito).get(verificarToken, obtenerCarrito);

export default router;