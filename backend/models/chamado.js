import {create, readAll, read, update} from '../config/database.js';

const criarChamado = async (chamadoData) => { 
  try {
    return await create('chamados', chamadoData); 
  } catch (error) {
    console.error('Erro ao criar chamado:', error); 
    throw error;
  }
};

const listarChamado = async () => {
  try {
    return await readAll('chamados');
  } catch (error) {
    console.error('Erro ao listar chamados: ', error);
    throw error;
  }
}

const obterChamadoPorId = async (id) => {
  try {
    return await read('chamados', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter chamado por ID: ', error);
    throw error;
  }
}

const atualizarChamado = async (req, res) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`);
      const { id } = req.params; 
      const { descricao } = req.body;

      const chamadoExistente = await obterChamadoPorId(id); 
      if (!chamadoExistente) {
          return res.status(404).json({ mensagem: 'Chamado não encontrado' });
      }

      const descricaoAtualizada = `${chamadoExistente.descricao}\n\n${descricao}`;
      
      await atualizarChamado(id, { descricao: descricaoAtualizada });
      res.status(200).json({ mensagem: 'Chamado atualizado com sucesso' });
  } catch (error) {
      console.error('Erro ao atualizar chamado: ', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar chamado.' });
  }
};

const criarApontamentos = async (id, apontamentosData) => {
  try{
    await create('apontamentos', {...apontamentosData, chamado_id: id});
  } catch (error) {
    console.error('Erro ao criar apontamento: ', error);
    throw error;
  }
}

const assumirChamado = async (req, res) => {
  try {
      const { id } = req.params; 
      const tecnico_id = req.user.id; 
      const resultado = await assumirChamado(id, tecnico_id);
      res.status(200).json({ mensagem: 'Chamado assumido com sucesso', chamado: resultado });
  } catch (error) {
      console.error('Erro ao assumir chamado:', error);
      res.status(400).json({ mensagem: error.message });
  }
};

const getChamadosStatus = async (tecnicoId) => {
  try {
    const total = await query(`SELECT COUNT(*) as total FROM chamados WHERE tecnico_id = ?`, [tecnicoId]);
    const emAndamento = await query(`SELECT COUNT(*) as total FROM chamados WHERE tecnico_id = ? AND status = 'em andamento'`, [tecnicoId]);
    const aberto = await query(`SELECT COUNT(*) as total FROM chamados WHERE tecnico_id = ? AND status = 'aberto'`, [tecnicoId]);
    const finalizado = await query(`SELECT COUNT(*) as total FROM chamados WHERE tecnico_id = ? AND status = 'finalizado'`, [tecnicoId]);

    return {
      total: total[0].total,
      emAndamento: emAndamento[0].total,
      aberto: aberto[0].total,
      finalizado: finalizado[0].total,
    };
  } catch (error) {
    console.error('Erro ao buscar status do técnico: ', error);
    throw error;
  }
};

const getChamadosStatusAdmin = async () => {
  try {
    const total = await query(`SELECT COUNT(*) as total FROM chamados`);
    const emAndamento = await query(`SELECT COUNT(*) as total FROM chamados WHERE status = 'em andamento'`);
    const aberto = await query(`SELECT COUNT(*) as total FROM chamados WHERE status = 'aberto'`);
    const finalizado = await query(`SELECT COUNT(*) as total FROM chamados WHERE status = 'finalizado'`);

    return {
      total: total[0].total,
      emAndamento: emAndamento[0].total,
      aberto: aberto[0].total,
      finalizado: finalizado[0].total,
    };
  } catch (error) {
    console.error('Erro ao buscar status admin: ', error);
    throw error;
  }
};

const getRankingTecnicos = async () => {
  try {
    const ranking = await query(`
      SELECT t.id, t.nome, COUNT(c.id) as totalFinalizados
      FROM chamados c
      JOIN tecnicos t ON c.tecnico_id = t.id
      WHERE c.status = 'finalizado'
      GROUP BY t.id, t.nome
      ORDER BY totalFinalizados DESC
      LIMIT 5
    `);

    const maior = ranking[0]?.totalFinalizados || 1;
    return ranking.map(r => ({
      tecnicoId: r.id,
      nome: r.nome,
      totalFinalizados: r.totalFinalizados,
      percentual: Math.round((r.totalFinalizados / maior) * 100)
    }));
  } catch (error) {
    console.error('Erro ao buscar ranking de técnicos: ', error);
    throw error;
  }
};

const getCategoriasChamados = async () => {
  try {
    const categorias = await query(`
      SELECT categoria, COUNT(*) as total
      FROM chamados
      GROUP BY categoria
      ORDER BY total DESC
    `);

    return categorias;
  } catch (error) {
    console.error('Erro ao buscar categorias: ', error);
    throw error;
  }
};

export {
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
};