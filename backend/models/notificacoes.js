import { create, readAll, update } from "../config/database.js";

const criarNotificacao = async () => {
    try {
        return await create('notificacoes', {
            usuario_id: usuario_id,
            tecnico_id: tecnico_id,
            mensagem,
            status: 'nao_vista'
        })
        
    } catch (error) {
        console.error('Erro ao criar notificações: ', error);
        throw error;
        
    }
}

const listarNotificacoesPorTecnico = async () => {
    try {
        return await readAll('notificacoes', `tecnico_id = ${tecnico_id} ORDER BY criado_em DESC`)
        
    } catch (error) {
        console.error('Erro ao listar notificações: ', error);
        throw error;
    }
}

const listarNotificacoesPorUsuario = async () => {
    try {
        return await readAll('notificacoes', `usuario_id = ${usuario_id} ORDER BY criado_em DESC`)
        
    } catch (error) {
        console.error('Erro ao listar notificaçõs por usuário', error);
        throw error;
    }
};

const marcarComoVista = async (id) => {
    try {
        return await update('notificacoes', { status: 'vista'}, `id = ${id}`)
    } catch (error) {
        console.error('Erro ao atualizar as notificações como vista: ', error);
        throw error;
    }
}

export {criarNotificacao, listarNotificacoesPorTecnico, listarNotificacoesPorUsuario, marcarComoVista};