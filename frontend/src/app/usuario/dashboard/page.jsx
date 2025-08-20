'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function DashboardTecnico({ params }) {

  const [nomeUsuario, setNomeUsuario] = useState('');
  const router = useRouter();
  const API_URL = "http://localhost:8080/usuarios";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.descricao !== 'usuario') {
        router.push('/');
        return;
      }

      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        alert('Seu Login Expirou.');
        router.push('/login');
        return;
      }

      const id = decoded.id;

      fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(data => {
          setNomeUsuario(data.nome);
        })
        .catch(err => {
          console.error("Erro ao buscar usuário: ", err);
          setNomeUsuario('Usuário'); // fallback
        });

    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
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

