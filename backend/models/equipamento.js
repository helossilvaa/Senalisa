import { create, deleteRecord, read, readAll, update } from '../config/database.js';

const criarEquipamento = async (equipamentoData) => {
    try {
        return await create('equipamentos', equipamentoData);
        
    } catch (error) {
       console.error('Erro ao criar equipamento: ', error);
       throw error; 
    }
};

const listarEquipamentos = async () => {
    try {
        return await readAll('equipamentos')
    } catch (error) {
        console.error('Erro ao listar equipamentos: ', error);
        throw error;
    }
};

const obterEquipamentoId = async (id) => {
    try {
        return await read('equipamentos', `id = ${id}`);
        
    } catch (error) {
        console.error('Erro ao obter equipamento por Id: ', error);
        throw error;
    }
};

const atualizarEquipamento = async (id, equipamentoData) => {
    try {
        return await update('equipamentos', equipamentoData, `id = ${id}`)

    } catch (error) {
        console.error('Erro ao atualizar equipamento: ', error);
        throw error;
    }
};

const deletarEquipamento = async (id) => {
    try {
        return await deleteRecord('equipamentos', `id = ${id}`);
    } catch (error) {
        console.error('Erro ao deletar equipamento: ', error);
        throw error;
    }
};

export {criarEquipamento, atualizarEquipamento, listarEquipamentos, deletarEquipamento, obterEquipamentoId};