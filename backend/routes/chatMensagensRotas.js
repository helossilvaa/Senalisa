import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  criarMensagemController,
  listarMensagensController,
  obterMensagemPorIdController,
} from '../controllers/chatMensagensController.js';

const router = express.Router();

// Criar mensagem
router.post('/', authMiddleware, criarMensagemController);

// Listar todas as mensagens de um chat
router.get('/chat/:chatId', authMiddleware, listarMensagensController);

// Obter uma mensagem específica pelo ID
router.get('/:id', authMiddleware, obterMensagemPorIdController);

export default router;
