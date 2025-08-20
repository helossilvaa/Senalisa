import express from 'express';
import { obterPoolIdController, listarPoolsController } from "../controllers/poolController.js";
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/pools', authMiddleware, listarPoolsController);

router.options('/pools', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})

router.get('/pools/:id', authMiddleware, obterPoolIdController);

router.options('/pools/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
});

export default router;
