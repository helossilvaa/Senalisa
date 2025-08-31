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

const listarChamadosPendentes = async () => {
  try {
    return await readAll('chamados', 'status = "pendente" AND tecnico_id IS NULL');
  } catch (error) {
    console.error('Erro ao listar chamados pendentes: ', error);
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


export {criarChamado, listarChamado, obterChamadoPorId, atualizarChamado, criarApontamentos, assumirChamado, listarChamadosPendentes, atualizarStatusChamado};
