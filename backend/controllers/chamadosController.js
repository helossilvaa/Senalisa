import {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos} from "../models/chamado.js";


const criarChamadoController = async (req, res ) => {
    try {
        const {
            chamado_id,
            titulo,
            descricao,
            tipo_id,
            tecnico_id,
            usuario_id,
            criado_em,
            sala_id,
            equipamento_id,
            atualizado_em
        } = req.body;
        
        const chamadoData = {
        chamado_id: chamado_id,
        titulo: titulo,
        descricao: descricao,
        tipo_id: tipo_id,
        tecnico_id: tecnico_id,
        usuario_id: usuario_id,
        criado_em: criado_em,
        atualizado_em: atualizado_em,
        sala_id: sala_id,
        equipamento_id: equipamento_id
        };

        const chamadoId = await criarChamado(chamadoData)
        
        res.status(201).json({mensagem: 'Chamado criado com sucesso', chamadoId});

    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({mensagem: 'Erro ao criar chamado.'})
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


export {listarChamadosController, atualizarChamadoController, criarChamadoController, obterChamadoPorIdController, criarApontamentoController}


