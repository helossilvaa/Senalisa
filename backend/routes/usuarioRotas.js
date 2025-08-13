import express from 'express';
import { criarUsuarioController, listarUsuariosController, obterUsuarioIdController } from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/usuarios', authMiddleware, criarUsuarioController);

router.get('/usuarios', authMiddleware, listarUsuariosController);

router.get('/usuarios/:id', authMiddleware, obterUsuarioIdController);

router.options('/usuarios/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
});

router.options('/usuarios', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send();
});

export default router;