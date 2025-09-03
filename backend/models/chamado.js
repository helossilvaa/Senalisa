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

const atualizarChamado = async (id, chamadoData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`)
  } catch (error) {
    console.error('Erro ao atualizar chamado: ', error);
    throw error;
  }
}

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

const atribuirChamado = async (chamadoId, tecnico_id) => {
    try {
      const dadosParaAtualizar = {
        tecnico_id: tecnico_id,
        status: 'em andamento'
      };
      const condicao = `id = ${chamadoId}`;
      return await update('chamados', dadosParaAtualizar, condicao);
    } catch (error) {
      console.error('Erro ao atribuir chamado:', error);
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
    const chamados = await readAll('chamados'); 

 
    const agrupados = chamados.reduce((acc, chamado) => {
      const key = chamado.tipo_id; 
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});


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
    const chamados = await readAll('chamados');

  
    const concluidos = chamados.filter(c => c.status === 'concluído');

   
    const ranking = concluidos.reduce((acc, chamado) => {
      const tecnico = chamado.tecnico_id || 'Sem técnico';
      acc[tecnico] = (acc[tecnico] || 0) + 1;
      return acc;
    }, {});

    const resultado = Object.entries(ranking).map(([tecnico, count]) => ({
      nomeTecnico: `Técnico ${tecnico}`,
      chamadosConcluidos: count
    }));

    
    return resultado.sort((a, b) => b.chamadosConcluidos - a.chamadosConcluidos).slice(0, 3);
  } catch (error) {
    console.error('Erro ao listar ranking de técnicos:', error);
    throw error;
  }
};




export {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos, assumirChamado, listarChamadosPendentes, atualizarStatusChamado, atualizarPrazoChamado, listarChamadosPorCategoria, listarRankingTecnicos, atribuirChamado};
