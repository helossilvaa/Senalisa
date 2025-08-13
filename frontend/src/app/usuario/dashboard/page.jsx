'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function DashboardTecnico() {
  const [nomeUsuario, setNomeUsuario] = useState(''); // Nome que virá do backend

  useEffect(() => {
    // Aqui você faz a chamada à API do backend
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:8080/usuario'); // Ajuste para sua rota real
        const data = await response.json();
        setNomeUsuario(data.nome); // Supondo que o backend retorne { nome: 'William' }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setNomeUsuario('Usuário'); // fallback
      }
    };

    fetchUsuario();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.welcome}>Olá, {nomeUsuario}!</h2>

      <div className={styles.cardsContainer}>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.cardLarge}></div>
        <div className={styles.cardSmallBottom}></div>
      </div>
    </div>
  );
}
