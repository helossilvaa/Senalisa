import express from 'express';
import { atualizarSalaController, obterSalaIdController, criarSalaController, deletarSalaController, listarSalasController } from '../controllers/salaController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/salas', authMiddleware, criarSalaController);

router.get('/salas', authMiddleware, listarSalasController);

router.get('/salas/:id', authMiddleware, obterSalaIdController);

router.put('/salas/:id', authMiddleware, atualizarSalaController);

router.delete('/salas/:id', authMiddleware, deletarSalaController);

router.options('/salas', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send();
});

router.options('/salas/:id', (req, res) => {
    res.setHeader('Allow', 'PUT, DELETE, GET, OPTIONS');
    res.status(204).send();

});

export default router;
