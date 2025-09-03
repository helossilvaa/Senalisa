
'use client'
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header/header';
import Calendar from '@/components/Calendario/page';
import styles from './page.module.css';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { SidebarProvider } from '@/components/Header/sidebarContext'
 
export default function DashboardUsuario({ params }) {
 
  const [nomeUsuario, setNomeUsuario] = useState('');
 
  const router = useRouter();
 
  const API_URL = "http://localhost:8080";
 
  useEffect(() => {
    const token = localStorage.getItem("token");
 
    if (!token) {
      router.push("/login");
      return;
    }
 
    try {
 
      const decoded = jwtDecode(token);
 
      if (decoded.funcao !== 'usuario') {
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
 
      fetch(`${API_URL}/usuarios/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
              setNomeUsuario(data.nome);
            })
            .catch(err => {
              console.error("Erro ao buscar usuário: ", err);
              setNomeUsuario('nome');
            });
 
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("token");
          router.push("/login");
        }
  }, []);
 
  return (
    <>
      <SidebarProvider>
        <div className={styles.page}>
          <Header />
          <div className={styles.dashboardContainer}>
            <h2 className={styles.welcome}>Olá, William!</h2>
            <div className={styles.cardsContainer}>
              <div className={styles.cardStatusChamados}>
                <h3>Status dos seus chamados:</h3>
                <p className={styles.numeroChamados}>90 <span>(quantidade total de chamados)</span></p>
                <div className={styles.barraProgresso}>
                  <div className={styles.progresso}></div>
                </div>
                <ul className={styles.legenda}>
                  <li><span className={styles.bolinhaAndamento}></span> Em andamento</li>
                  <li><span className={styles.bolinhaAberto}></span> Aberto</li>
                  <li><span className={styles.bolinhaFinalizado}></span> Finalizado</li>
                </ul>
              </div>
              <div className={styles.cardNotificacoes}>
                <h3>Você tem</h3>
                <p className={styles.numeroNotificacoes}>5</p>
                <p className={styles.textoNotificacoes}>notificações novas</p>
              </div>
              <div className={styles.cardLarge}>
                <h3>Chamados recentes</h3>
                <div className={styles.chamadoItem}>
                  <div>
                    <h4>Iluminação ruim</h4>
                    <p>Sala</p>
                  </div>
                  <div>
                    <button className={styles.btnVerMais}>Ver mais</button>
                  </div>
                </div>
                <div className={styles.chamadoItem}>
                  <div>
                    <h4>Iluminação ruim</h4>
                    <p>Sala</p>
                  </div>
                  <div>
                    <button className={styles.btnVerMais}>Ver mais</button>
                  </div>
                </div>
                <div className={styles.chamadoItem}>
                  <div>
                    <h4>Iluminação ruim</h4>
                    <p>Sala</p>
                  </div>
                  <div>
                    <button className={styles.btnVerMais}>Ver mais</button>
                  </div>
                </div>
              </div>
              <div className={styles.cards}>
                <div className={styles.cardSmallBottom}>
                  <h3>Calendário</h3>
                  <Calendar />
                </div>
              </div>
            </div>
          </div>
        </div >
      </SidebarProvider>
    </>
  );
}