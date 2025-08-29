import express from 'express';

import { criarChamadoController, listarChamadosController, listarChamadosParaTecnicoController, obterChamadoPorIdController, atualizarChamadoController, assumirChamadoController, criarApontamentoController, listarChamadosDoUsuarioController, finalizarChamadoController} from '../controllers/chamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

//se for usuario
router.get('/', authMiddleware, listarChamadosController);
router.post('/', authMiddleware, criarChamadoController);
router.get('/chamados', authMiddleware, listarChamadosDoUsuarioController);

//se for admin
router.get('/todoschamados', verifyRole(['admin']), listarChamadosController);     
router.put('/chamados/:id', verifyRole(['admin']), atualizarChamadoController); 
router.get('/chamados/:id', verifyRole(['admin']), obterChamadoPorIdController);

//se for tecnico 
router.get('/meuschamados', verifyRole(['tecnico']), listarChamadosParaTecnicoController); 
router.put('/assumirChamado/:id', verifyRole(['tecnico']), assumirChamadoController);
router.put('/meuschamados/:id/status', verifyRole(['tecnico']), atualizarChamadoController);
router.put('/finalizar/:id', verifyRole(['tecnico']), finalizarChamadoController);


router.post('/:id/apontamentos', criarApontamentoController);

export default router;
