import { listarRelatorios, buscarRelatorios } from '../models/relatorio.js';
import { read, readAll } from '../config/database.js';

const getFullRelatorioData = async (relatorios) => {
    return Promise.all(
        relatorios.map(async (r) => {
            const chamado = await read('chamados', `id = ${r.chamado_id}`);
            const tecnico = r.tecnico_id ? await read('usuarios', `id = ${r.tecnico_id}`) : null;
            const usuario = chamado?.usuario_id ? await read('usuarios', `id = ${chamado.usuario_id}`) : null;
            const equipamento = chamado?.equipamento_id ? await read('equipamentos', `patrimonio = ${chamado.equipamento_id}`) : null;
            const sala = chamado?.sala_id ? await read('salas', `id = ${chamado.sala_id}`) : null;

            return {
                ...r,
                chamado: chamado ? {
                    id: chamado.id,
                    titulo: chamado.titulo,
                    descricao: chamado.descricao,
                    status: chamado.status,
                } : null,
            };
        })
    );
};

export const buscarRelatoriosController = async (req, res) => {
    try {
        if (req.user.funcao !== 'admin') {
            return res.status(403).json({ mensagem: 'Acesso negado' });
        }
        const filtros = req.query;

        const relatorios = await buscarRelatorios(filtros);
        const relatoriosComDados = await getFullRelatorioData(relatorios);

        res.status(200).json(relatoriosComDados);
    } catch (error) {
        console.error('Erro ao buscar relatórios com filtros:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar relatórios' });
    }
};

export const listarRelatoriosController = async (req, res) => {
    try {
        if (req.user.funcao !== 'admin') {
            return res.status(403).json({ mensagem: 'Acesso negado' });
        }
        const relatorios = await listarRelatorios();
        const relatoriosComDados = await getFullRelatorioData(relatorios);
        res.status(200).json(relatoriosComDados);
    } catch (error) {
        console.error('Erro ao listar relatórios:', error);
        res.status(500).json({ mensagem: 'Erro ao listar relatórios' });
    }
};

// Novo controlador para listar por técnicos
export const listarRelatoriosPorTecnicoController = async (req, res) => {
    try {
        if (req.user.funcao !== 'admin') {
            return res.status(403).json({ mensagem: 'Acesso negado' });
        }
        const relatorios = await listarRelatorios();
        const relatoriosComDados = await getFullRelatorioData(relatorios);
        res.status(200).json(relatoriosComDados);
    } catch (error) {
        console.error('Erro ao listar relatórios por técnico:', error);
        res.status(500).json({ mensagem: 'Erro ao listar relatórios por técnico' });
    }
};

// Novo controlador para listar por equipamentos
export const listarRelatoriosPorEquipamentoController = async (req, res) => {
    try {
        if (req.user.funcao !== 'admin') {
            return res.status(403).json({ mensagem: 'Acesso negado' });
        }
        const relatorios = await listarRelatorios();
        const relatoriosComDados = await getFullRelatorioData(relatorios);
        res.status(200).json(relatoriosComDados);
    } catch (error) {
        console.error('Erro ao listar relatórios por equipamento:', error);
        res.status(500).json({ mensagem: 'Erro ao listar relatórios por equipamento' });
    }
};