import {create, readAll, read, update, query} from '../config/database.js';

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

const listarChamadosPendentes = async (poolsIds) => {
    try {
        if (!poolsIds || poolsIds.length === 0) {
            return [];
        }

        const placeholders = poolsIds.map(() => '?').join(', ');
        const sql = `
            SELECT c.*
            FROM chamados c
            JOIN pool p ON c.tipo_id = p.id
            WHERE c.status = 'pendente' AND p.id IN (${placeholders});
        `;

        return await query(sql, poolsIds);
    } catch (error) {
        console.error('Erro ao buscar chamados pendentes por setor:', error);
        throw error;
    }
};

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

const atualizarStatusChamado = async (chamadoId, novoStatus) => {
  try {
      const dadosParaAtualizar = { status: novoStatus };
      const id = `id = ${chamadoId}`;

      return await update('chamados', dadosParaAtualizar, id);
  } catch (error) {
      console.error('Erro ao atualizar o status do chamado:', error);
      throw error;
  }
};

const criarApontamentos = async (id, apontamentoData) => {
  try{
    await create('apontamentos', {...apontamentoData, chamado_id: id});
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

        return await update('chamados', { tecnico_id: tecnicoId, status: 'em andamento'}, `id = ${id}`);
    } catch (error) {
        console.error('Erro ao assumir chamado: ', error);
        throw error;
    }
};

const atualizarPrazoChamado = async (id, prazo) => {
    try {
        const dadosParaAtualizar = { prazo: prazo };
        return await update('chamados', dadosParaAtualizar, `id = ${id}`);
    } catch (error) {
        console.error('Erro ao atualizar o prazo do chamado:', error);
        throw error;
    }
};

const listarChamadosPorCategoria = async () => {
  try {
    const chamados = await readAll('chamados'); // pega todos os chamados

    // agrupar por tipo_id
    const agrupados = chamados.reduce((acc, chamado) => {
      const key = chamado.tipo_id; 
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // transformar em array [{ name: "tipo_id X", value: count }]
    return Object.entries(agrupados).map(([tipo, count]) => ({
      name: `Categoria ${tipo}`,
      value: count
    }));
  } catch (error) {
    console.error('Erro ao listar chamados por categoria:', error);
    throw error;
  }
};

const listarRankingTecnicos = async () => {
  try {
    const chamados = await readAll('chamados'); // pega todos os chamados

    // filtra só concluídos
    const concluidos = chamados.filter(c => c.status === 'concluído');

    // agrupar por tecnico_id
    const ranking = concluidos.reduce((acc, chamado) => {
      const tecnico = chamado.tecnico_id || 'Sem técnico';
      acc[tecnico] = (acc[tecnico] || 0) + 1;
      return acc;
    }, {});

    // transformar em array [{ nomeTecnico: tecnico_id, chamadosConcluidos: count }]
    const resultado = Object.entries(ranking).map(([tecnico, count]) => ({
      nomeTecnico: `Técnico ${tecnico}`,
      chamadosConcluidos: count
    }));

    // ordenar e pegar só os 3 primeiros
    return resultado.sort((a, b) => b.chamadosConcluidos - a.chamadosConcluidos).slice(0, 3);
  } catch (error) {
    console.error('Erro ao listar ranking de técnicos:', error);
    throw error;
  }
};

export {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos, assumirChamado, listarChamadosPendentes, atualizarStatusChamado, atualizarPrazoChamado, listarChamadosPorCategoria, listarRankingTecnicos };
