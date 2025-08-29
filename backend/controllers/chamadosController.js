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
        const chamadoId = await criarChamado(chamadoData);
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

// Função para listar chamados para um técnico
const listarChamadosParaTecnicoController = async (req, res) => {
    try {
        const tecnico_id = req.usuarioId;
        const chamadosFiltrados = chamados.filter(c => c.status !== 'encerrado' && (c.tecnico_id === null || c.tecnico_id === tecnico_id));
        res.status(200).json(chamadosFiltrados);
    } catch (error) {
        console.error('Erro ao listar chamados para técnico:', error);
        res.status(500).json({ mensagem: 'Erro ao listar chamados' });
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

// Função para finalizar um chamado e gerar um relatório
const finalizarChamadoController = async (req, res) => {
    
    console.log("Finalizar chamado acionado!");

    try {
        const { id } = req.params;
        const { descricao_solucao } = req.body;
        const tecnico_id = req.usuarioId;

        console.log(`Recebendo requisição para finalizar o chamado ${id}`);
        console.log(`Descrição da solução: ${descricao_solucao}`);
        console.log(`ID do técnico: ${tecnico_id}`);

        //Obter o chamado existente
        const chamadoExistente = await obterChamadoPorId(id);

        if (!chamadoExistente) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
        }

        //Verificar se o chamado já está finalizado
        if (chamadoExistente.status === 'encerrado') {
            return res.status(400).json({ mensagem: 'Chamado já foi encerrado.' });
        }

        //Atualizar o status do chamado para 'encerrado'
        const dataFim = new Date();
        const dataInicio = new Date(chamadoExistente.criado_em);
        const duracaoSegundos = Math.floor((dataFim - dataInicio) / 1000);

        const dadosParaAtualizarChamado = {
            status: 'encerrado',
            fim: dataFim.toISOString().slice(0, 19).replace('T', ' ')
        };
        await atualizarChamado(id, dadosParaAtualizarChamado);

        //Criar o relatório automaticamente
        const relatorioData = {
            chamado_id: chamadoExistente.id,
            tecnico_id: tecnico_id,
            descricao: descricao_solucao,
            comeco: chamadoExistente.criado_em,
            fim: new Date().toISOString(), 
            duracao: duracaoSegundos
        };

        console.log("Dados do relatório a ser criado:", relatorioData);

        const relatorioId = await criarRelatorio(relatorioData);

        console.log("Relatório criado com ID:", relatorioId);

        res.status(200).json({ mensagem: 'Chamado finalizado e relatório gerado com sucesso.', relatorioId });
    } catch (error) {
        console.error('Erro ao finalizar chamado e gerar relatório:', error);
        res.status(500).json({ mensagem: 'Erro ao finalizar chamado.' });
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
    listarChamadosParaTecnicoController,
    getChamadosStatusController,
    getChamadosStatusAdminController,
    getRankingTecnicosController,
    getCategoriasChamadosController,
    finalizarChamadoController
};
