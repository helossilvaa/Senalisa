import express from 'express';
import { criarChamadoController, listarChamadosController, listarChamadosDoTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, listarChamadosGeraisController, atualizarStatusChamadoController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);
router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController);
   
router.put('/chamados/:id', atualizarChamadoController); 
router.get('/chamados/:id', obterChamadoPorIdController);

router.get('/meuschamados', listarChamadosDoTecnicoController); 
router.get('/gerais', listarChamadosGeraisController); //mudar p pendente dps
router.put('/assumir/:id', assumirChamadoController);
router.put('/:id/status', authMiddleware, atualizarStatusChamadoController);

router.post('/:id/apontamentos', criarApontamentoController);


export default router;
