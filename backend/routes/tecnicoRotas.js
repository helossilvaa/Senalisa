import express from "express"
import {obterUsuarioIdController, listarUsuariosController, criarUsuarioController} from '../controllers/usuarioController.js';
import { listarNotificacoes, marcarComoVista } from '../controllers/notificacoesController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/tecnicos', authMiddleware, criarUsuarioController);

router.options('/tecnicos', (req,res) => {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(204).send();
})

router.get('/tecnicos', authMiddleware, listarUsuariosController);

router.options('/tecnicos', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
});

router.get('/tecnicos/:id', authMiddleware, obterUsuarioIdController);

router.options('/tecnicos/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
});

router.get('/tecnicos/:id/notificacoes', authMiddleware ,listarNotificacoes);
router.put('/tecnicos/:id/notificacoes/vista', authMiddleware, marcarComoVista);

export default router;