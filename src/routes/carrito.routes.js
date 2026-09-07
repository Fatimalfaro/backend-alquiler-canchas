import {Router} from 'express';
import { agregarAlCarrito, obtenerCarrito, vaciarCarrito, restarCantidadProducto, eliminarProductoCarrito  } from '../controllers/carrito.controllers.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/').post(verificarToken, agregarAlCarrito).get(verificarToken, obtenerCarrito).delete(verificarToken, vaciarCarrito);
router.route('/restar/:productoId').patch(verificarToken, restarCantidadProducto)
router.route('/producto/:productoId').delete(verificarToken, eliminarProductoCarrito)

export default router;