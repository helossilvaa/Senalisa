import {criarUsuario, listarUsuarios, obterUsuario} from '../models/usuario.js';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import generateHashedPassword from "../hashPassword.js"
 
const criarUsuarioController = async (req, res) => {
  
  try {
    
    const email = req.user.userPrincipalName;
    const nome = req.user.displayName;
    const registro = req.user.sAMAccountName;
    const password = req.body.password;


    if (!password) {
      return res.status(400).json({ error: "Campo obrigatório ausente: insira a senha!" });
    }

    let usuario = await obterUsuario(registro);

    if (!usuario || usuario.length === 0) {
      console.log(`Usuário não encontrado no banco! Gerando novo usuário: ${nome}`);

      const senha = await generateHashedPassword(password);

      const usuarioData = {
        nome,
        email,
        senha
      };

      await criarUsuario(usuarioData);
      usuario = await obterUsuario(registro);
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        numeroRegistro: usuario.registro,
        descricao: usuario.descricao,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Autenticado com sucesso",
      token,
      user: {
        numeroRegistro: usuario.registro,
        displayName: usuario.nome,
        email: usuario.email,
        curso: usuario.descricao,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário no banco:", error);
    return res.status(500).json({ error: "Erro interno ao salvar usuário" });
  }
};

 
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