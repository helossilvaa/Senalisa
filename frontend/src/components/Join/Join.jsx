import React from 'react';
import io from 'socket.io-client';
import style from './Join.module.css';
import { Button } from '@mui/material';

export default function Join({ setChatVisibility, setSocket }) {
  const handleSubmit = async () => {
    const username = `Guest${Math.floor(Math.random() * 10000)}`;

    const socket = await io.connect('http://localhost:3001');
    socket.emit('set_username', username);
    setSocket(socket);
    setChatVisibility(true);
  };

  return (
    <div className={style['page-wrapper']}>
      <div className={style['join-container']}>
        <h2>Bem-vindo!</h2>
        <Button sx={{ mt: 2 }} onClick={handleSubmit} variant="contained">
          Entrar como Convidado
        </Button>
      </div>
    </div>
  );
  
}