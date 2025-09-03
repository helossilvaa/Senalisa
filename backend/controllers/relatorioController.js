import { listarRelatorios, buscarRelatorios } from '../models/relatorio.js';
import { read } from '../config/database.js';
import fs from 'fs';


const listarRelatoriosController = async (req, res) => {
  try {

    if (req.usuarioFuncao !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    const relatorios = await listarRelatorios();

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
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    res.status(500).json({ mensagem: 'Erro ao listar relatórios' });
  }
};

const buscarRelatoriosController = async (req, res) => {
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

const listarPdfsGeradosController = (req, res) => {
    try {
        const caminhoDaPasta = 'pdfs_gerados';
        if (!fs.existsSync(caminhoDaPasta)) {
            return res.status(200).json([]);
        }
        const arquivos = fs.readdirSync(caminhoDaPasta);
        res.status(200).json(arquivos);
    } catch (error) {
        console.error('Erro ao listar PDFs:', error);
        res.status(500).json({ mensagem: 'Erro ao listar PDFs' });
    }
};

const listarRelatoriosRecentesController = async (req, res) => {
  try {
    if (req.usuarioFuncao !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    const limite = parseInt(req.query.limite) || 4;

    let relatorios = await listarRelatorios();

    relatorios.sort((a, b) => new Date(b.fim) - new Date(a.fim));

    const ultimosRelatorios = relatorios.slice(0, limite);

    console.log("Relatórios mais recentes:", ultimosRelatorios);

    const relatoriosCompletos = await Promise.all(
      ultimosRelatorios.map(async (r) => {
        const chamado = await read('chamados', `id = ${r.chamado_id}`);
        const tecnico = await read('usuarios', `id = ${r.tecnico_id}`);
        
        console.log("Relatório completo:", {
          ...r,
          chamado,
          tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null,
        });

        return {
          ...r,
          chamado,
          tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null,
        };
      })
    );

    return res.status(200).json(relatoriosCompletos);
  } catch (error) {
    console.error('Erro ao listar relatórios recentes:', error);
    res.status(500).json({ mensagem: 'Erro ao listar relatórios recentes' });
  }
};

export { listarRelatoriosController, buscarRelatoriosController, listarPdfsGeradosController, listarRelatoriosRecentesController };