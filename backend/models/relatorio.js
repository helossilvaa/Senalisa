import { create, readAll, read } from '../config/database.js';

/**
 * Cria um novo relatório
 * @param {Object} relatorioData - Dados do relatório
 * @param {number} relatorioData.chamado_id - ID do chamado relacionado
 * @param {number} relatorioData.tecnico_id - ID do técnico que finalizou o chamado
 * @param {string} relatorioData.descricao - Descrição do trabalho realizado
 * @param {Date} relatorioData.comeco - Timestamp de início do chamado
 * @param {Date} relatorioData.fim - Timestamp de término do chamado
 */
const criarRelatorio = async (relatorioData) => {
  try {
    return await create('relatorios', relatorioData);
  } catch (error) {
    console.error('Erro ao criar relatório:', error);
    throw error;
  }
};

/**
 * Lista todos os relatórios
 * @returns {Promise<Array>} Lista de relatórios
 */
const listarRelatorios = async () => {
  try {
    return await readAll('relatorios');
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    throw error;
  }
};

/**
 * Busca um relatório pelo ID
 * @param {number} id - ID do relatório
 * @returns {Promise<Object>} Relatório encontrado
 */
const obterRelatorioPorId = async (id) => {
  try {
    return await read('relatorios', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter relatório por ID:', error);
    throw error;
  }
};

/**
 * Busca relatórios com filtros 
 * @param {Object} filtro - Exemplo: { tecnico_id: 1, chamado_id: 5 }
 * @returns {Promise<Array>} Lista de relatórios filtrados
 */
const buscarRelatorios = async (filtro) => {
  try {
    const conditions = Object.entries(filtro)
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
      .join(' AND ');

    return await readAll('relatorios', conditions);
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    throw error;
  }
};

export {criarRelatorio, listarRelatorios, obterRelatorioPorId, buscarRelatorios};
