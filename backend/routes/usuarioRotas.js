import express from 'express';
import { criarUsuarioController, listarUsuariosController, obterUsuarioIdController, obterUsuarioLogadoController} from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
 
const router = express.Router();
 
router.post('/', authMiddleware, criarUsuarioController);
 
router.get('/', authMiddleware, listarUsuariosController);
 
router.get('/:id', authMiddleware, obterUsuarioIdController);

router.get('/meuperfil', authMiddleware, obterUsuarioLogadoController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    res.status(204).send();
})
 
router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})
 
 
export default router;