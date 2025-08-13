import express from 'express';
import { listarChamadosController, obterChamadoPorIdController, atualizarChamadoController, criarChamadoController, criarApontamentoController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/chamados', authMiddleware, listarChamadosController);

router.post('/chamados', authMiddleware, criarChamadoController);

router.post('/chamados/:id', authMiddleware, criarApontamentoController);

router.get('/chamados/:id', authMiddleware, obterChamadoPorIdController);

router.put('/chamados/:id', authMiddleware, atualizarChamadoController);

router.options('/chamados/:id', (req, res) => {
    res.setHeader('Allow', 'PUT, GET, POST, OPTIONS');
    res.status(204).send();
});

router.options('/chamados', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send();
})

export default router;
