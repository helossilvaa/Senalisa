import express from 'express';
import { criarChamadoController, listarChamadosController, listarChamadosDoTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, listarChamadosPendentesController, atualizarStatusChamadoController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);
router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController);

router.get('/meuschamados', listarChamadosDoTecnicoController); 

router.get('/pendentes', authMiddleware, listarChamadosPendentesController);
router.put('/assumir/:id', authMiddleware, assumirChamadoController);
router.put('/:id/status', authMiddleware, atualizarStatusChamadoController);

router.post('/:id/apontamentos', criarApontamentoController);

router.put('/:id', atualizarChamadoController); 
router.get('/:id', obterChamadoPorIdController);


export default router;
