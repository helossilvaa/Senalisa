import express from 'express';
import { 
  listarRelatoriosController, 
  listarRelatoriosPorTecnicoController,
  listarRelatoriosPorEquipamentoController,
  buscarRelatoriosController
} from '../controllers/relatorioController.js'; 
import { gerarRelatoriosPdfController } from '../controllers/relatorioPDFcontroller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Rota para listar todos os relatórios (chamados)
router.get('/', listarRelatoriosController);

// Rota para listar relatórios de todos os técnicos
router.get('/tecnicos', listarRelatoriosPorTecnicoController);

// Rota para listar relatórios de todos os equipamentos
router.get('/equipamentos', listarRelatoriosPorEquipamentoController);

// Rota para buscar relatórios com filtros (query params)
router.get('/buscar', buscarRelatoriosController);

// Rota para gerar PDF
router.get('/pdf', gerarRelatoriosPdfController);

export default router;
