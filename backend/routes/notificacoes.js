import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { criarNotificacaoController, deletarNotificacaoController, marcarComoVistaController, listarNotificacoesController } from '../controllers/notificacoesController';

const router = express.Router();

router.get('/', authMiddleware, listarNotificacoesController);
router.post('/', authMiddleware, criarNotificacaoController);
router.put('/:id/marcarvista', authMiddleware, marcarComoVistaController);
router.delete('/:id', authMiddleware, deletarNotificacaoController);

router.options('/', (req, res)=> {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'PUT, OPTIONS');
    res.status(204).send();
});

router.options('/:id/marcarVista', (req, res)=> {
    res.setHeader('Allow', 'PUT, OPTIONS');
    res.status(204).send();
});


export default router;