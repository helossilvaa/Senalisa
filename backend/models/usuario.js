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

const obterUsuario = async (registro)=> {
    try {
        return await read('usuarios', `registro = ${registro}`)
    } catch (error) {
        console.error('Erro ao obter usuario por registro: ', error);
        throw error;
    }
};

const obterUsuarioId = async (id) => {
  try {
    return await read('usuarios', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter usuário por id:', error);
    throw error;
  }
};


const obterUsuarioPorEmail = async (email) => {

    try {
        return await read('usuarios', `email = '${email}'`);
    } catch (error) {
        console.error('Erro ao obter usuario por email: ', error);
        throw error;
    }
    
  };

const verificarPrimeiroLogin = async (id) => {
    const usuario = await read('usuarios', `id = ${id}`);
    return usuario.primeiro_login === 1; // 1 = true, 0 = false
};

const marcarLoginFeito = async (id) => {
    await update('usuarios', { primeiro_login: 0 }, `id = ${id}`);
};

export {criarUsuario, listarUsuarios, obterUsuario, obterUsuarioPorEmail, obterUsuarioId, verificarPrimeiroLogin, marcarLoginFeito};
