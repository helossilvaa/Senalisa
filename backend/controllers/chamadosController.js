<<<<<<< HEAD
import {
    criarChamado,
    listarChamado,
    obterChamadoPorId,
    atualizarChamado,
    criarApontamentos,
    assumirChamado,
    getChamadosStatus,
    getChamadosStatusAdmin,
    getRankingTecnicos,
    getCategoriasChamados
} from "../models/chamado.js";
import { criarRelatorio } from "../models/relatorio.js";
=======
import {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos, assumirChamado, atualizarStatusChamado, listarChamadosPendentes, atualizarPrazoChamado, listarChamadosPorCategoria, listarRankingTecnicos} from "../models/chamado.js";
import { listarPoolsTecnico } from "../models/poolTecnico.js";
import { criarNotificacao } from "../models/notificacoes.js";
import { criarRelatorio } from "../models/relatorio.js";
import notificacaoTextos from '../utils/notificacoesTextos.js';

>>>>>>> 39d5ed45624232b6fcd84d6b37b42331c95054f2

// Função para criar um novo chamado
const criarChamadoController = async (req, res) => {
    try {
        const {
            titulo,
            descricao,
            tipo_id,
            sala_id,
            equipamento_id
        } = req.body;

        const equipamentoIdNumerico = parseInt(equipamento_id, 10);

        const chamadoData = {
            titulo,
            descricao,
            tipo_id,
            usuario_id: req.usuarioId,
            tecnico_id: null,
            sala_id,
            equipamento_id: equipamentoIdNumerico,
            status: 'pendente'   
        };
        
       
        const chamadosExistentes = await listarChamado();
        const jaExiste = chamadosExistentes.some(c => 
            c.equipamento_id === equipamentoIdNumerico && c.status !== 'concluído'
        );
        

        if (jaExiste) {
            return res.status(400).json({ mensagem: 'Já existe um chamado ativo para este equipamento.' });
        }

        
        const chamadoId = await criarChamado(chamadoData);

        const poolsDoTecnico = await listarPoolsTecnico(req.usuarioId); 
        for (const tecnico_id of poolsDoTecnico) {
            const mensagem = notificacaoTextos.NOVO_CHAMADO(chamadoId); 
            await criarNotificacao({
                usuario_id: req.usuarioId, 
                tecnico_id,
                mensagem,
                visualizado: 0
            });
        }
        res.status(201).json({ mensagem: 'Chamado criado com sucesso', chamadoId });

    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({ mensagem: 'Erro ao criar chamado.' });
    }
};

// Função para listar todos os chamados
const listarChamadosController = async (req, res) => {
    try {
        const chamados = await listarChamado();
        res.status(200).json(chamados);
    } catch (error) {
        console.error('Erro ao listar chamados: ', error);
        res.status(500).json({ mensagem: "Erro ao listar chamados." });
    }
}

// Função para listar chamados de um usuário específico
const listarChamadosDoUsuarioController = async (req, res) => {
    try {
        const userId = req.usuarioId;
        const todosChamados = await listarChamado();
        const chamadosDoUsuario = todosChamados.filter(c => c.usuario_id === userId);
        res.json(chamadosDoUsuario);
    } catch (error) {
        console.error('Erro ao listar chamados: ', error);
        res.status(500).json({ mensagem: "Erro ao listar chamados." });
    }
};

// Função para obter um chamado por ID
const obterChamadoPorIdController = async (req, res) => {
    try {
        const chamado = await obterChamadoPorId(req.params.id);
        if (!chamado) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado' });
        }
        res.status(200).json(chamado);
    } catch (error) {
        console.error("Erro ao obter chamado por ID: ", error);
        res.status(500).json({ mensagem: 'Erro ao obter chamado por ID' });
    }
};

// Função para atualizar um chamado
const atualizarChamadoController = async (req, res) => {

    try {
        const {
            chamado_id,
            descricao,
        } = req.body;

        const chamadoExistente = await obterChamadoPorId(chamado_id);

        if (!chamadoExistente) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado' });
        }

        const descricaoAtualizada = `${chamadoExistente.descricao}\n\n${descricao}`;

        const chamadoAtualizado = {
            chamado_id,
            descricao: descricaoAtualizada
        }

        await atualizarChamado(chamadoAtualizado);

        res.status(200).json({ mensagem: 'Chamado atualizado com sucesso' });

    } catch (error) {
        console.error('Erro ao atualizar chamado: ', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar chamado.' });
    }
};

// Função para criar um apontamento
const criarApontamentoController = async (req, res) => {
    try {
        const {
            apontamento
        } = req.body;

        const userId = req.usuarioId;
        const chamadoId = req.params.id;

        const chamadoExistente = await obterChamadoPorId(chamadoId);

        if (!chamadoExistente) {
            return res.status(404).json({mensagem: 'Chamado não encontrado'});
        };

        const tipoApontamento = (userId === chamadoExistente.usuario_id) ? 'usuario' : 'tecnico';

        if (tipoApontamento === 'tecnico' && chamadoExistente.tecnico_id !== userId) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para adicionar apontamentos a este chamado.' });
        }

        const apontamentoData = {
            usuario_id: req.usuarioId,
            apontamento: apontamento,
            tipo: tipoApontamento
        }

        if (tipoApontamento === 'tecnico') {
            const mensagem = notificacaoTextos.NOVO_APONTAMENTO_TECNICO(chamadoId);
            await criarNotificacao({
                usuario_id: chamadoExistente.usuario_id,
                tecnico_id: userId,
                mensagem,
                visualizado: 0
            });
        }

        const apontamentoId = await criarApontamentos(chamado_id, apontamentoData);
        res.status(201).json({ mensagem: 'Apontamento criado com sucesso', apontamentoData: apontamentoId });


    } catch (error) {
        console.error('Erro ao criar apontamento: ', error);
        res.status(500).json({ mensagem: 'Erro ao criar apontamento. ' });
    }
};

// Função para um técnico assumir um chamado
const assumirChamadoController = async (req, res) => {
    try {
        const { id } = req.params;
        const tecnico_id = req.usuarioId; 

        const chamadoExistente = await obterChamadoPorId(id);

        if (!chamadoExistente) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
        }

        const nomeTecnico = req.usuarioNome 

        const resultado = await assumirChamado(id, tecnico_id);

        const mensagem = notificacaoTextos.CHAMADO_EM_ANDAMENTO(id, nomeTecnico);
        const notificacoesData = {
            usuario_id: chamadoExistente.usuario_id,
            tecnico_id: tecnico_id,
            mensagem,
            visualizado: 0,
        };

        await criarNotificacao(notificacoesData);


        res.status(200).json({ mensagem: 'Chamado assumido com sucesso', chamado: resultado });

        
    } catch (error) {
        console.error('Erro ao assumir chamado:', error);
        res.status(400).json({ mensagem: error.message });
    }
};

const estipularPrazoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { prazo } = req.body;
        const tecnico_id = req.usuarioId; 

        const chamado = await obterChamadoPorId(id);

        if (!chamado) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
        }
        
        if (chamado.tecnico_id !== tecnico_id) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para estipular o prazo deste chamado.' });
        }
        
        await atualizarPrazoChamado(id, prazo);

        await criarNotificacao({
            usuario_id: chamado.usuario_id,
            tecnico_id,
            mensagem: notificacaoTextos.PRAZO_ESTIPULADO(id, prazo),
            visualizado: 0
        });

        res.status(200).json({ mensagem: 'Prazo estipulado com sucesso.' });
    } catch (error) {
        console.error('Erro ao estipular prazo:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};


const atualizarStatusChamadoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, solucao } = req.body; 
        const tecnicoId = req.usuarioId; 

        const chamadoExistente = await obterChamadoPorId(id);
        if (!chamadoExistente) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
        }

        
        if (chamadoExistente.tecnico_id !== tecnicoId) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para alterar o status deste chamado.' });
        }

        await atualizarStatusChamado(id, status);

        let mensagem;
        let notificacoesData;

        if (status === 'concluido') { 
            const comeco = new Date(chamadoExistente.criado_em); 
            const fim = new Date();
            
            const solucaoFornecida = solucao || null;

            const relatorioData = {
                chamado_id: chamadoExistente.id,
                tecnico_id: tecnicoId,
                solucao: solucaoFornecida, 
                comeco: comeco,
                fim: fim
            };

            await criarRelatorio(relatorioData);

           
            mensagem = notificacaoTextos.CHAMADO_CONCLUIDO(id); 
            notificacoesData = {
                usuario_id: chamadoExistente.usuario_id,
                tecnico_id: tecnicoId,
                mensagem,
                visualizado: 0
            };
            await criarNotificacao(notificacoesData);

        } else if (status === 'em andamento') {
            
            mensagem = notificacaoTextos.CHAMADO_EM_ANDAMENTO(id, req.usuarioNome);
            notificacoesData = {
                usuario_id: chamadoExistente.usuario_id,
                tecnico_id: tecnicoId,
                mensagem,
                visualizado: 0,
            };
            await criarNotificacao(notificacoesData);
        }

        return res.status(200).json({ mensagem: `Status do chamado ${id} atualizado para ${status}.` });

    } catch (error) {
        console.error('Erro ao atualizar status do chamado:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao atualizar status.' });
    }
};


const listarChamadosPendentesController = async (req, res) => {
    try {
        const tecnicoId = req.usuarioId; 
        
        if (!tecnicoId) {
            return res.status(400).json({ mensagem: 'ID do técnico ausente.' });
        }
        
        
        const poolsIds = await listarPoolsTecnico(tecnicoId);
        
        if (poolsIds.length === 0) {
            return res.status(200).json([]);
        }

       
        const chamadosPendentes = await listarChamadosPendentes(poolsIds); 
        
        res.status(200).json(chamadosPendentes);
    } catch (error) {
        console.error('Erro ao listar chamados pendentes:', error);
        res.status(500).json({ mensagem: 'Erro ao listar chamados pendentes.' });
    }
};


const listarChamadosDoTecnicoController = async (req, res) => {
  try {
    const tecnico_id = req.usuarioId;
    const todosChamados = await listarChamado();
    const chamadosDoTecnico = todosChamados.filter(c => c.status === 'em andamento' && c.tecnico_id === tecnico_id);
    res.status(200).json(chamadosDoTecnico);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar chamados do técnico' });
  }
};

// Função para obter o status dos chamados de um técnico
const getChamadosStatusController = async (req, res) => {
    try {
        const tecnicoId = req.usuarioId;
        const status = await getChamadosStatus(tecnicoId);
        res.status(200).json(status);
    } catch (error) {
        console.error("Erro ao buscar status do técnico:", error);
        res.status(500).json({ mensagem: "Erro ao buscar status do técnico" });
    }
};

const listarHistoricoChamadosController = async (req, res) => {
    try {
        const todosChamados = await listarChamado();
        const historico = todosChamados.filter(chamado => chamado.status === 'concluído');
        res.status(200).json(historico);
    } catch (error) {
        console.error('Erro ao listar histórico de chamados:', error);
        res.status(500).json({ mensagem: 'Erro ao obter histórico.' });
    }
};

const listarChamadosPorCategoriaController = async (req, res) => {
  console.log("Chegou no controller de categorias com user:", req.usuarioId);
  try {
    const dados = await listarChamadosPorCategoria();

    if (!dados || !Array.isArray(dados)) {
      
      console.error('Dados de categoria inválidos retornados do modelo.');
      return res.status(500).json({ mensagem: 'Dados de categoria inválidos.' });
    }
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro no controller listar chamados por categoria:', error);
    res.status(500).json({ mensagem: 'Erro ao listar chamados por categoria.' });
  }
};

const listarRankingTecnicosController = async (req, res) => {
  try {
    const ranking = await listarRankingTecnicos();
    res.status(200).json(ranking);
  } catch (error) {
    console.error('Erro no controller de ranking de técnicos:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar o ranking de técnicos.' });
  }
};

// Função para obter o ranking de técnicos
const getRankingTecnicosController = async (req, res) => {
    try {
        const ranking = await getRankingTecnicos();
        res.status(200).json(ranking);
    } catch (error) {
        console.error("Erro ao buscar ranking de técnicos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar ranking de técnicos" });
    }
};

export {listarChamadosController, atualizarChamadoController, criarChamadoController, obterChamadoPorIdController, criarApontamentoController, assumirChamadoController, listarChamadosPendentesController, listarChamadosDoTecnicoController, atualizarStatusChamadoController, listarHistoricoChamadosController, estipularPrazoController, listarChamadosPorCategoriaController, listarRankingTecnicosController};