import express from 'express';
import { criarEquipamentoController, listarEquipamentosController, atualizarEquipamentoController, deletarEquipamentoController, obterEquipamentoPorPatrimonioController } from '../controllers/equipamentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/equipamentos', authMiddleware, criarEquipamentoController);
router.get('/equipamentos', authMiddleware, listarEquipamentosController);
router.get('/equipamentos/:patrimonio', authMiddleware, obterEquipamentoPorPatrimonioController);
router.put('/equipamentos/:patrimonio', authMiddleware, atualizarEquipamentoController);
router.delete('/equipamentos/:patrimonio', authMiddleware, deletarEquipamentoController);

router.options('/equipamentos', (req, res) => {
    res.setHeader('Allow', 'POST, GET');
    res.status(204).send();
});

router.options('/equipamentos/:patrimonio', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send();
});

export default router;