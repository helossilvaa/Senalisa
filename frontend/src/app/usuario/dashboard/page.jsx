'use client'
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header/header';
import Calendar from '@/components/Calendario/page';
import styles from './page.module.css';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { SidebarProvider } from '@/components/Header/sidebarContext'
import { Andada_Pro } from 'next/font/google';


export default function DashboardUsuario({ params }) {
   const [chamados, setChamados] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  const router = useRouter();
  const API_URL = "http://localhost:8080";

  const fetchNotificacoes = async (token) => {
    try {
      const response = await fetch(`${API_URL}/notificacoes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar notificações');
      }

      const data = await response.json();
      setNotifications(data);

      //  sobre as notificaçoes não lidas, e atualizando o estado delas
      const countNaoLidas = data.filter(n => n.visualizado === 0).length;
      setNotificacoesNaoLidas(countNaoLidas);

    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const chamadosRecentes = chamados
    .filter(c => c.status?.trim().toLowerCase() === "pendente")
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 3);

  console.log("Chamados recentes (pendentes):", chamadosRecentes);

  const totalChamados = chamados.length;
  const statusCounts = {
    'em andamento': chamados.filter(c => c.status?.toLowerCase().includes("andamento")).length,
    'concluído': chamados.filter(c => c.status?.toLowerCase().includes("concluído")).length,
  };

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

      fetchNotificacoes(token);

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
            <h2 className={styles.welcome}>Olá, {nomeUsuario}</h2>
            <div className={styles.cardsContainer}>
              <div className={styles.cardStatusChamados}>
                <h3>Status dos chamados da rede:</h3>
                <p className={styles.numeroChamados}>{totalChamados}</p>
                <div className={styles.barraProgresso}>
                  {totalChamados > 0 && statusCounts['em andamento'] > 0 && (
                    <div
                      className={styles.progressoEmAndamento}
                      style={{ width: `${(statusCounts['em andamento'] / totalChamados) * 100}%` }}
                    />
                  )}
                  {totalChamados > 0 && statusCounts['concluído'] > 0 && (
                    <div
                      className={styles.progressoFinalizado}
                      style={{ width: `${(statusCounts['concluído'] / totalChamados) * 100}%` }}
                    />
                  )}
                </div>
                <ul className={styles.legenda}>
                  <li><span className={styles.bolinhaAndamento}></span> Em andamento ({statusCounts['em andamento']})</li>
                  <li><span className={styles.bolinhaFinalizado}></span> Concluído ({statusCounts['concluído']})</li>
                </ul>
              </div>
              <div className={styles.cardNotificacoes}>
                <h3>Você tem</h3>
                <p className={styles.numeroNotificacoes}>{notificacoesNaoLidas}</p>
                <p className={styles.textoNotificacoes}>notificações novas</p>
              </div>
              <div className={styles.cardLarge}>
                <div className="d-flex">
                  <h3>Notificações recentes</h3>
                </div>
                <ul className="list-group list-group-flush p-2">
                  {isLoading ? (
                    <p className="text-muted text-center mt-3">Carregando notificações...</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-muted text-center mt-3">Nenhuma notificação por enquanto.</p>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className="list-group-item d-flex align-items-center justify-content-between notification-item" style={{ marginTop: '10px'}}
                      //
                      >
                        <div>
                          <p className="mb-1 fw-semibold textNotification">{n.mensagem}</p>
                        </div>
                        {n.visualizado === 0 && <span className="badge bg-danger rounded-circle p-2"></span>}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className={styles.cardSmallBottom}>
                <h3>Calendário</h3>
                <Calendar />
              </div>
            </div>
          </div>
        </div >
      </SidebarProvider>
    </>
  );
}