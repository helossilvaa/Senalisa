import {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos, assumirChamado} from "../models/chamado.js";


const criarChamadoController = async (req, res) => {
    try {
        const {
            titulo,
            descricao,
            tipo_id,
            sala_id,
            equipamento_id
        } = req.body;

        const chamadoData = {
            titulo,
            descricao,
            tipo_id,
            usuario_id: req.usuarioId, 
            tecnico_id: null,        
            sala_id,
            equipamento_id,
            status: 'pendente'   
        };
        
        // Verifica se já existe um chamado ativo para o equipamento
        const chamadosExistentes = await listarChamado();
        const jaExiste = chamadosExistentes.some(c => 
            c.equipamento_id === equipamento_id && c.status !== 'encerrado'
        );

        if (jaExiste) {
            return res.status(400).json({ mensagem: 'Já existe um chamado ativo para este equipamento.' });
        }

        // Se não existir, cria o chamado
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
        const { chamado_id } = req.body;
        const tecnico_id = req.usuarioId; 

        const resultado = await assumirChamado(chamado_id, tecnico_id);

        res.status(200).json({ mensagem: 'Chamado assumido com sucesso', chamado: resultado });
    } catch (error) {
        console.error('Erro ao assumir chamado:', error);
        res.status(400).json({ mensagem: error.message });
    }
};

const listarChamadosParaTecnicoController = async (req, res) => {
  try {
    const tecnico_id = req.usuarioId;
    const todosChamados = await listarChamado(); 
    const chamados = todosChamados.filter(
      c => c.status === 'pendente' && (!c.tecnico_id || c.tecnico_id === tecnico_id)
    );
    res.status(200).json(chamados);
  } catch (error) {
    console.error('Erro ao listar chamados para técnico:', error);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};



export {listarChamadosController, atualizarChamadoController, criarChamadoController, obterChamadoPorIdController, criarApontamentoController, assumirChamadoController, listarChamadosParaTecnicoController};


