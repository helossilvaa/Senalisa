import {create, readAll, read } from '../config/database.js';

const criarUsuario = async (usuarioData) => {
    try {
        return await create('usuarios', usuarioData)
    } catch(error) {
        console.error('Erro ao criar usuario: ', error);
        throw error;
    }
}

const listarUsuarios = async () => {
    try {
        return await readAll('usuarios');
    } catch (error) {
       console.error('Erro ao listar usuarios: ', error);
        throw error;
    }
}

const obterUsuarioId = async (id)=> {
    try {
        return await read('usuarios', `id = ${id}`)
    } catch (error) {
        console.error('Erro ao obter usuario por ID: ', error);
        throw error;
    }
}
/** 
 * @param {string} email
 */
export const findByEmail = async (email) => {
  try {

    return await read('usuarios', `email = '${email}'`);
  } catch (error) {
    console.error('Erro ao buscar usuário por email: ', error);
    throw error;
  }
};

export {criarUsuario, listarUsuarios, obterUsuarioId};
