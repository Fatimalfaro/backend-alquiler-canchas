import {Router} from 'express';
import { agregarAlCarrito } from '../controllers/carrito.controllers.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/').post(verificarToken, agregarAlCarrito);

export default router;