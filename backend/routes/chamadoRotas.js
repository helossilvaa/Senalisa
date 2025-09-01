import express from 'express';
import { criarChamadoController, listarChamadosController, listarChamadosDoTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, listarChamadosPendentesController, atualizarStatusChamadoController, listarHistoricoChamadosController} from '../controllers/chamadosController.js';
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

router.post('/:id/apontamentos', authMiddleware, criarApontamentoController);

router.put('/:id',authMiddleware, atualizarChamadoController); 
router.get('/:id', authMiddleware, obterChamadoPorIdController);


export default router;
