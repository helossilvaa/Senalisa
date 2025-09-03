import express from 'express';
import { criarChamadoController, listarChamadosController, listarTodosChamadosDoTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, listarChamadosPendentesController, atualizarStatusChamadoController, listarHistoricoChamadosController, estipularPrazoController,
listarRankingTecnicosController, listarChamadosPorCategoriaController, listarChamadosConcluidosDoTecnicoController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController); 
router.get('/pendentes', authMiddleware, listarChamadosPendentesController);
router.get('/chamados/concluidos', authMiddleware, listarChamadosConcluidosDoTecnicoController);
router.get('/chamadoseutecnico', authMiddleware, listarTodosChamadosDoTecnicoController);
router.get('/historico', authMiddleware, listarHistoricoChamadosController);
router.get('/categorias', listarChamadosPorCategoriaController);
router.get('/ranking-tecnicos', authMiddleware, listarRankingTecnicosController);

router.post('/:id/apontamentos', authMiddleware, criarApontamentoController);
router.put('/assumir/:id', authMiddleware, assumirChamadoController);
router.put('/:id/status', authMiddleware, atualizarStatusChamadoController);
router.put('/prazo/:id', authMiddleware, estipularPrazoController);
router.put('/:id',authMiddleware, atualizarChamadoController);
router.get('/:id', authMiddleware, obterChamadoPorIdController);

router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);

export default router;
