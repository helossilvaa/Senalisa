import { create, readAll, read, update} from '../config/database.js';


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
    return await read ('chamados', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter chamado por ID: ', error);
    throw error;
  }
}

const atualizarChamado = async (id, chamadoData) => {
  try {
    await update('chamado', chamadoData, `id = ${id}`)
  } catch (error) {
    console.error('Erro ao atualizar chamado: ', error);
    throw error;
  }
}

