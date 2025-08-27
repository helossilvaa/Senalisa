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
    return await readAll('chamados', 'tecnico_id IS NULL');
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

const atualizarChamado = async (id, chamadoData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`)
  } catch (error) {
    console.error('Erro ao atualizar chamado: ', error);
    throw error;
  }
}

const criarApontamentos = async (id, apontamentosData) => {
  try{
    await create('apontamentos', {...apontamentosData, chamado_id: id});
  } catch (error) {
    console.error('Erro ao criar apontamento: ', error);
    throw error;
  }
}

const assumirChamado = async (id, tecnicoId) => {
    try {
        const chamado = await read('chamados', `id = ${id}`);
        if (!chamado) throw new Error('Chamado não encontrado');
        if (chamado.tecnico_id) throw new Error('Chamado já foi assumido');

        return await update('chamados', { tecnico_id: tecnicoId, status: 'em andamento' }, `id = ${id}`);
    } catch (error) {
        console.error('Erro ao assumir chamado: ', error);
        throw error;
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