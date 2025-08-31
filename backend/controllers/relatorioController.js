import { listarRelatorios, buscarRelatorios } from '../models/relatorio.js';
import { read } from '../config/database.js';

/**
 * Controller para listar todos os relatórios (só admin)
 */
const listarRelatoriosController = async (req, res) => {
  try {
    // Verifica se o usuário é admin
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    // Busca todos os relatórios
    const relatorios = await listarRelatorios();

    // Para cada relatório, adiciona dados do chamado e do técnico
    const relatoriosComDados = await Promise.all(
      relatorios.map(async (r) => {
        const chamado = await read('chamados', `id = ${r.chamado_id}`);
        const tecnico = await read('usuarios', `id = ${r.tecnico_id}`);
        return {
          ...r,
          chamado,
          tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null
        };
      })
    );

    res.status(200).json(relatoriosComDados);
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    res.status(500).json({ mensagem: 'Erro ao listar relatórios' });
  }
};

/**
 * Controller para buscar relatórios filtrados (por técnico ou chamado)
 * @param {Object} req.query - Pode conter tecnico_id ou chamado_id
 */
const buscarRelatoriosController = async (req, res) => {
  try {
    if (req.user.funcao !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    const filtro = {};
    if (req.query.tecnico_id) filtro.tecnico_id = Number(req.query.tecnico_id);
    if (req.query.chamado_id) filtro.chamado_id = Number(req.query.chamado_id);

    const relatorios = await buscarRelatorios(filtro);

    const relatoriosComDados = await Promise.all(
      relatorios.map(async (r) => {
        const chamado = await read('chamados', `id = ${r.chamado_id}`);
        const tecnico = await read('usuarios', `id = ${r.tecnico_id}`);
        return {
          ...r,
          chamado,
          tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null
        };
      })
    );

    res.status(200).json(relatoriosComDados);
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar relatórios' });
  }
};

export { listarRelatoriosController, buscarRelatoriosController };
