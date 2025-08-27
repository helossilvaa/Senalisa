import express from 'express';
import { listarRelatoriosController, buscarRelatoriosController } from '../controllers/relatoriosController.js';
import { gerarRelatoriosPdfController } from '../controllers/relatorioPDFcontroller.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar todos os relatórios (admin)
router.get('/chamados/relatorios', listarRelatoriosController);

// Buscar relatórios filtrados (admin)
router.get('/chamados/buscar', buscarRelatoriosController);

router.get('/chamados/pdf', gerarRelatoriosPdfController);

router.get('/reports', listarRelatoriosController);

router.get('/reports/buscar', buscarRelatoriosController);

router.get('/reports/pdf', gerarRelatoriosPdfController);

export default router;
