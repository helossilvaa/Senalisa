import express from 'express';
import passport from '../config/ldap.js';
import { criarUsuarioController } from "../controllers/usuarioController.js";

const router = express.Router();


router.post('/login', (req, res, next) => {

  passport.authenticate('ldapauth', { session: true }, (err, user, info) => {

    try {
      if (err) {
        console.error('Erro na autenticação:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
      }

      if (!user) {
        console.warn('Falha na autenticação:', info?.message || 'Credenciais inválidas');
        return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
      }

      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          console.error('Erro ao criar sessão:', loginErr);
          return res.status(500).json({ error: 'Erro ao criar sessão' });
        }

        console.log('Usuário autenticado:', user.username);

        // Chama o controller que cria/verifica o usuário e gera token
        await criarUsuarioController(req, res); 
        
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
      res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Nenhum usuário autenticado' });
  }

  console.log('Usuário deslogando:', req.user?.username);

  req.logout((err) => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }

      res.clearCookie('connect.sid');
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
});

// Verificação de autenticação
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName,
      },
    });
  }

  res.status(401).json({ authenticated: false });
});

export default router;


