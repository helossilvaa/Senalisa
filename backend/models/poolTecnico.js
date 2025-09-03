import { read, readAll, create, update, deleteRecord, query} from "../config/database.js";

// Listar pools, com controle de função
const listarPoolsTecnico = async (tecnicoId) => {
    try {
        const sql = `SELECT id_pool FROM pool_tecnico WHERE tecnico_id = ?`;
        const rows = await query(sql, [tecnicoId]);
        return rows.map(row => row.id_pool);
    } catch (error) {
        console.error('Erro ao listar pools do técnico:', error);
        throw error;
    }
};

// Obter pool por id, com verificação de acesso
const obterPoolTecnicoId = async (id, user) => {
    try {
        const pool = await read('pools', `id = ${id}`);
        if (!pool) return null;

        // Checa se o usuário tem acesso
        if (user.funcao === 'admin' || pool.tecnico_id === user.id) {
            return pool;
        } else {
            throw new Error('Acesso negado');
        }
    } catch (error) {
        console.error('Erro ao obter pool por id: ', error);
        throw error;
    }
};

// Criar pool (admin direciona chamado para técnico)
const criarPoolTecnico = async (poolTecnicoData, user) => {
    try {
        if (req.usuarioFuncao !== 'admin') throw new Error('Apenas admin pode criar pools');
        return await create('pools', poolTecnicoData);
    } catch (error) {
        console.error('Erro ao criar pool: ', error);
        throw error;
    }
};

// Atualizar pool (admin ou técnico pode atualizar status)
const atualizarPoolTecnico = async (id, poolTecnicoData, user) => {
    try {
        const pool = await read('pools', `id = ${id}`);
        if (!pool) throw new Error('Pool não encontrado');

        // Admin pode atualizar qualquer coisa, técnico só status
        if (req.usuarioFuncao === 'admin') {
            return await update('pools', poolTecnicoData, `id = ${id}`);
        } else {
            throw new Error('Acesso negado');
        }
    } catch (error) {
        console.error('Erro ao atualizar pool: ', error);
        throw error;
    }
};

// Deletar pool (somente admin)
const deletarPoolTecnico = async (id, user) => {
    try {
        if (req.usuarioFuncao !== 'admin') throw new Error('Apenas admin pode deletar pools');
        return await deleteRecord('pools', `id = ${id}`);
    } catch (error) {
        console.error('Erro ao deletar pool: ', error);
        throw error;
    }
};

export { listarPoolsTecnico, obterPoolTecnicoId, criarPoolTecnico, atualizarPoolTecnico, deletarPoolTecnico };