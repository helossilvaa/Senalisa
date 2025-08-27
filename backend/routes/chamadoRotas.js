import express from 'express';
import { criarChamadoController, listarChamadosController, listarChamadosDoTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, listarChamadosGeraisController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

//se for usuario
router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);
router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController);


router.get('/todoschamados', listarChamadosController);     
router.put('/chamados/:id', atualizarChamadoController); 
router.get('/chamados/:id', obterChamadoPorIdController);

//se for tecnico 
router.get('/meuschamados', listarChamadosDoTecnicoController); 
router.get('/gerais', listarChamadosGeraisController);
router.put('/assumirChamado/:id', assumirChamadoController);
router.put('/meuschamados/:id/status', atualizarChamadoController);

router.post('/:id/apontamentos', criarApontamentoController);


export default router;
