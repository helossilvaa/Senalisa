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
        res.status(201).json({ mensagem: 'Apontamento criado com sucesso', apontamentoData: apontamentoId });

    } catch (error) {
        console.error('Erro ao criar apontamento: ', error);
        res.status(500).json({ mensagem: 'Erro ao criar apontamento. ' });
    }
}

// Função para um técnico assumir um chamado
const assumirChamadoController = async (req, res) => {
    try {
        const { chamado_id } = req.body;

        const tecnico_id = req.user.id; 

        const resultado = await assumirChamado(chamado_id, tecnico_id);

        res.status(200).json({ mensagem: 'Chamado assumido com sucesso', chamado: resultado });
    } catch (error) {
        console.error('Erro ao assumir chamado:', error);
        res.status(400).json({ mensagem: error.message });
    }
};


const listarChamadosGeraisController = async (req, res) => {
  try {
    const todosChamados = await listarChamado();
    const chamadosGerais = todosChamados.filter(c => c.status === 'pendente' && !c.tecnico_id);
    res.status(200).json(chamadosGerais);
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

// Função para obter o status dos chamados para administradores
const getChamadosStatusAdminController = async (req, res) => {
    try {
        const status = await getChamadosStatusAdmin();
        res.status(200).json(status);
    } catch (error) {
        console.error("Erro ao buscar status admin:", error);
        res.status(500).json({ mensagem: "Erro ao buscar status admin" });
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

// Função para obter categorias de chamados
const getCategoriasChamadosController = async (req, res) => {
    try {
        const categorias = await getCategoriasChamados();
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ mensagem: "Erro ao buscar categorias" });
    }
};

export {
    criarChamadoController,
    listarChamadosController,
    listarChamadosDoUsuarioController,
    obterChamadoPorIdController,
    atualizarChamadoController,
    criarApontamentoController,
    assumirChamadoController,
    listarChamadosDoTecnicoController,
    listarChamadosGeraisController,
    getChamadosStatusController,
    getChamadosStatusAdminController,
    getRankingTecnicosController,
    getCategoriasChamadosController
};
