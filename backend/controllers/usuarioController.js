import { criarUsuario, listarUsuarios, obterUsuarioId } from '../models/usuario.js';
import bcrypt from 'bcryptjs';


const criarUsuarioController = async (req, res) => {
    try {
        const {
            nome,
            email,
            senha,
            funcao
        } = req.body;

        const usuarioData = {
            nome: nome,
            email: email,
            senha: await bcrypt.hash(senha, 10),
            funcao: funcao
        }
        
        const usuarioId = await criarUsuario(usuarioData);
        res.status(201).json({mensagem: 'Usuario criado com sucesso', usuarioId})

    } catch (error) {
        console.error('Erro ao criar usuário: ', error);
        res.status(500).json({mensagem: 'Erro ao criar usuario.', error});

    }
}

const listarUsuariosController = async (req, res) => {
    try {
        
        const usuarios = await listarUsuarios();

        res.status(200).json(usuarios);
        
    } catch (error) {
        console.error('Erro ao listar usuário: ', error);
        res.status(500).json({mensagem: 'Erro ao listar usuarios', error});
    }
}

const obterUsuarioIdController = async (req, res) => {
    try {
        const usuario = await obterUsuarioId(req.params.id);
        res.status(200).json(usuario);

    } catch (error) {
        console.error('Erro ao obter usuário por id: ', error);
        res.status(500).json({mensagem: 'Erro ao obter usuário por id', error});
    }
}

export {criarUsuarioController, listarUsuariosController, obterUsuarioIdController};