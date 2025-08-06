import express from 'express';
import { listarChamadosController, obterChamadoPorIdController, atualizarChamadoController, criarChamadoController, criarApontamentoController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/chamados', authMiddleware, listarChamadosController);

router.options('/chamados', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})

router.post('/chamados', authMiddleware, criarChamadoController);

router.options('/chamados', (req, res) => {
    res.setHeader('Allow',  'POST, OPTIONS');
    res.status(204).send();
})

router.post('/chamados/:id', authMiddleware, criarApontamentoController);

router.options('/chamados/:id', (req, res) => {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(204).send();
})

router.get('/chamados/:id', authMiddleware, obterChamadoPorIdController);

router.options('/chamados/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})

router.put('/chamados/:id', authMiddleware, atualizarChamadoController);

router.options('/chamados/:id', (req, res) => {
    res.setHeader('Allow', 'PUT, OPTIONS');
    res.status(204).send();
})

export default router;
