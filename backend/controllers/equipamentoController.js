import { listarEquipamentos, obterEquipamentoId, atualizarEquipamento, deletarEquipamento, criarEquipamento } from "../models/equipamento.js";

const criarEquipamentoController = async (req, res) => {
    try {
        const {
            patrimonio,
            sala_id,
            equipamento
        } = req.body;

        const equipamentoData = {
            patrimonio: patrimonio,
            sala_id: sala_id,
            equipamento: equipamento
        }

        const equipamentoId = await criarEquipamento(equipamentoData);

        res.status(201).json({mensagem: 'Equipamento criado com sucesso!', equipamentoId});

        
    } catch (error) {
        console.error('Erro ao criar equipamento: ', error);
        res.status(500).json({mensagem: 'Erro ao criar equipamento'})
    }
};


const listarEquipamentosController = async (req, res) => {
    try {
        const equipamentos = await listarEquipamentos();
        res.status(201).json(equipamentos);
    } catch (error) {
        console.error('Erro ao listar equipamentos: ', error);
        res.status(500).json({mensagem: 'Erro ao listar equipamentos'});
    }
};

const obterEquipamentoIdController = async (id) => {
    try {
        const equipamento = await obterEquipamentoId(req.params.id);

        if(!equipamento) {
            return res.status(404).json({mensagem: 'Equipamento não encontrado'});
        };

        res.status(200).json(equipamento);

        
    } catch (error) {
        console.error('Erro ao obter equipamento por id: ', error);
        res.status(500).json({mensagem: 'Erro ao obter equipamento por id'})
    }
};

const deletarEquipamentoController = async (id) => {
    try {
        const equipamentoId = req.params.id;
        const equipamento = await obterEquipamentoId(req.params.id);

        await deletarEquipamento(equipamentoId);
        res.status(200).json({mensagem: 'Equipamento deletado com sucesso!'})
        
    } catch (error) {
        console.error('Erro ao deletar equipamento: ', error);
        res.status(500).json({mensagem: 'Erro ao deletar equipamento'})
        
    }
};

const atualizarEquipamentoController = async (id) => {
    try {
        
    } catch (error) {
        console.error('Erro ao atualizar equipamento: ', error)
    }
}