import express from 'express';
import { criarChamadoController, listarChamadosController, listarChamadosDoTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, listarChamadosPendentesController, atualizarStatusChamadoController, listarHistoricoChamadosController, estipularPrazoController,
listarRankingTecnicosController, listarChamadosPorCategoriaController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);
router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController);

router.get('/chamadostecnico', authMiddleware, listarChamadosDoTecnicoController); 

router.get('/pendentes', authMiddleware, listarChamadosPendentesController);
router.put('/assumir/:id', authMiddleware, assumirChamadoController);
router.put('/:id/status', authMiddleware, atualizarStatusChamadoController);
router.get('/historico', authMiddleware, listarHistoricoChamadosController);
router.put('/prazo/:id', authMiddleware, estipularPrazoController);

router.get('/categorias', listarChamadosPorCategoriaController);
router.get('/ranking-tecnicos', authMiddleware, listarRankingTecnicosController);

router.post('/:id/apontamentos', authMiddleware, criarApontamentoController);

router.put('/:id',authMiddleware, atualizarChamadoController); 
router.get('/:id', authMiddleware, obterChamadoPorIdController);


export default router;
