import express from 'express';
import jwt from 'jsonwebtoken';
import { criarUsuario, findByEmail } from '../models/usuario.js';
import passport from '../config/ldap.js';

const router = express.Router();

// Dados dos usuários de teste
const testUsers = [
  { nome: 'Admin User', email: 'admin@zelos.com', senha: 'password123', funcao: 'administrador' },
  { nome: 'Tech User', email: 'tecnico@zelos.com', senha: 'password123', funcao: 'tecnico' },
  { nome: 'Common User', email: 'usuario@zelos.com', senha: 'password123', funcao: 'usuario_comum' },
];

// Rota de Login
router.post('/login', (req, res, next) => {
  passport.authenticate('ldapauth', { session: true }, async (err, user, info) => {
    if (err) {
      console.error('Erro na autenticação:', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    if (!user) {
      console.warn('Falha na autenticação LDAP:', info?.message || 'Credenciais inválidas');
      return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
    }

    // Loga o usuário manualmente para garantir a sessão
    req.logIn(user, async (loginErr) => {
      if (loginErr) {
        console.error('Erro ao criar sessão:', loginErr);
        return res.status(500).json({ error: 'Erro ao criar sessão' });
      }

      try {
        // Busca usuário no banco pelo email
        let usuario = await findByEmail(user.mail);

        if (!usuario) {
          const testUser = testUsers.find(u => u.email === user.mail);
          if (testUser) {
            await criarUsuario({
              nome: testUser.nome,
              email: testUser.email,
              senha: testUser.senha,
              funcao: testUser.funcao
            });
            usuario = await findByEmail(testUser.email);
          }
        }

        // Gera token JWT
        const payload = { id: usuario.id, funcao: usuario.funcao };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
          message: 'Autenticado com sucesso',
          token, 
          user: {
            username: user.username,
            displayName: user.displayName,
            email: user.mail
          }
        });
      } catch (error) {
        console.error('Erro inesperado:', error);
        res.status(500).json({ error: 'Erro inesperado no servidor' });
      }
    });
  })(req, res, next);
});


// Rota de Logout
router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Nenhum usuário autenticado' });

  req.logout(err => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }
    req.session.destroy(destroyErr => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
});

// Rota para checar autenticação
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
  res.status(401).json({ authenticated: false });
});

export default router;
