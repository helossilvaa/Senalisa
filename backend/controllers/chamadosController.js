import {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos, assumirChamado, atualizarStatusChamado, listarChamadosPendentes} from "../models/chamado.js";
import { criarNotificacao } from "../models/notificacoes.js";
import notificacaoTextos from '../utils/notificacoesTextos.js';


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
        console.log('Resultado da verificação (jaExiste):', jaExiste);

        if (jaExiste) {
            return res.status(400).json({ mensagem: 'Já existe um chamado ativo para este equipamento.' });
        }

        
        const chamadoId = await criarChamado(chamadoData);
        res.status(201).json({ mensagem: 'Chamado criado com sucesso', chamadoId });

    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({ mensagem: 'Erro ao criar chamado.' });
    }
};



const listarChamadosController = async (req, res) => {
    try {
        const chamados = await listarChamado();

        res.status(200).json(chamados);
        
    } catch (error) {
        console.error('Erro ao listar chamados: ', error);
        res.status(500).json({mensagem: "Erro ao listar chamados."});
    }
}


export const listarChamadosDoUsuarioController = async (req, res) => {
    try {
    const userId = req.usuarioId; 
    const todosChamados = await listarChamado(); 
    const chamadosDoUsuario = todosChamados.filter(c => c.usuario_id === userId);
    res.json(chamadosDoUsuario);

    } catch (error) {
        console.error('Erro ao listar chamados: ', error);
        res.status(500).json({mensagem: "Erro ao listar chamados."});
    }
    
};
  

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

const atualizarChamadoController = async (req, res) => {

    try {
        const {
            chamado_id,
            descricao,
            } = req.body;

        const chamadoExistente = await obterChamadoPorId(chamado_id);

        if (!chamadoExistente) {
            return res.status(404).json({mensagem: 'Chamado não encontrado'});
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


const criarApontamentoController = async (req, res) => {
    try {
        const {
            chamado_id,
            usuario_id,
            apontamento,
        } = req.body;

        const apontamentoData = {
            chamado_id: chamado_id,
            usuario_id: usuario_id,
            apontamento: apontamento
        }

        const apontamentoId = await criarApontamentos(chamado_id, apontamentoData);
        res.status(201).json({mensagem: 'Apontamento criado com sucesso', apontamentoData: apontamentoId});
        
    } catch (error) {
        console.error('Erro ao criar apontamento: ', error);
        res.status(500).json({mensagem: 'Erro ao criar apontamento. '});
    }
}

const assumirChamadoController = async (req, res) => {
    try {
        const { id } = req.params;
        const tecnico_id = req.usuarioId; 
        const resultado = await assumirChamado(id, tecnico_id);

        res.status(200).json({ mensagem: 'Chamado assumido com sucesso', chamado: resultado });
    } catch (error) {
        console.error('Erro ao assumir chamado:', error);
        res.status(400).json({ mensagem: error.message });
    }
};

const atualizarStatusChamadoController = async (req, res) => {

    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const chamadoExistente = await obterChamadoPorId(id);
      if (!chamadoExistente) {
        return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
      }
  
      await atualizarStatusChamado(id, status);
  
      let mensagem;
      if (status === 'em_andamento') {
        mensagem = notificacaoTextos.CHAMADO_EM_ANDAMENTO(id);
      } else if (status === 'concluido') {
        mensagem = notificacaoTextos.CHAMADO_CONCLUIDO(id);
      }
  
      const notificacoesData = {
        usuario_id: chamadoExistente.usuario_id, 
        mensagem,
        visualizado: 'nao_vista'
      };
  
      await criarNotificacao(notificacoesData);
  
      return res.status(200).json({ mensagem: `Status do chamado ${id} atualizado para ${status}.` });
    } catch (error) {
      console.error('Erro ao atualizar status do chamado:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao atualizar status.' });
    }
  };

const listarChamadosPendentesController = async (req, res) => {
  try {
    const chamadosPendentes = await listarChamadosPendentes();
    res.status(200).json(chamadosPendentes);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar chamados gerais' });
  }
};


const listarChamadosDoTecnicoController = async (req, res) => {
  try {
    const tecnico_id = req.usuarioId;
    const todosChamados = await listarChamado();
    const chamadosDoTecnico = todosChamados.filter(c => c.status === 'pendente' && c.tecnico_id === tecnico_id);
    res.status(200).json(chamadosDoTecnico);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar chamados do técnico' });
  }
};




export {listarChamadosController, atualizarChamadoController, criarChamadoController, obterChamadoPorIdController, criarApontamentoController, assumirChamadoController, listarChamadosPendentesController, listarChamadosDoTecnicoController, atualizarStatusChamadoController};


