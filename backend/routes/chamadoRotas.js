import express from 'express';
import { criarChamadoController, listarChamadosController, listarChamadosParaTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import verifyRole from '../middlewares/authVerifyRole.js';

const router = express.Router();

//se for usuario
router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);
router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController);


router.get('/todoschamados', listarChamadosController);     
router.put('/chamados/:id', atualizarChamadoController); 
router.get('/chamados/:id', obterChamadoPorIdController);

//se for tecnico 
router.get('/meuschamados', listarChamadosParaTecnicoController); 
router.put('/assumirChamado/:id', assumirChamadoController);
router.put('/meuschamados/:id/status', atualizarChamadoController);

router.post('/:id/apontamentos', criarApontamentoController);


export default router;
