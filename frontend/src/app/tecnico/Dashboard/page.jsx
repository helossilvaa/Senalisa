"use client";

import styles from '@/app/tecnico/Dashboard/page.module.css';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import ListaTarefa from '@/components/listaTarefa/listaTarefa';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function DashboardTecnico() {
  const [chamados, setChamados] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [notificacoes, setNotificacoes] = useState([]);
  const router = useRouter();
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDados = async () => {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          alert("Seu login expirou.");
          router.push("/login");
          return;
        }
        fetchData();

        setNomeUsuario(decoded.nome || 'Usuário não encontrado');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const resTecnico = await fetch(`${API_URL}/chamados/chamadostecnico`, config);
        const chamadosTecnico = resTecnico.ok ? await resTecnico.json() : [];

        const resPendentes = await fetch(`${API_URL}/chamados/pendentes`, config);
        const chamadosPendentes = resPendentes.ok ? await resPendentes.json() : [];

        // Combine e dedupe
        const mapChamados = new Map();
        [...chamadosTecnico, ...chamadosPendentes].forEach(c => {
          if (c && c.id != null && !mapChamados.has(c.id)) {
            mapChamados.set(c.id, c);
          }
        });
        const todosChamados = Array.from(mapChamados.values());

        console.log("Todos chamados combinados:", todosChamados);
        setChamados(todosChamados);

        // Notificações
        const resNotificacoes = await fetch(`${API_URL}/notificacoes`, config);

        console.log("Status da resposta de notificações:", resNotificacoes.status);

        if (!resNotificacoes.ok) {
          const textoErro = await resNotificacoes.text();
          console.error("Erro ao buscar notificações:", textoErro);
          setNotificacoes([]);
          return;
        }

        let dadosNotificacoes;
        try {
          dadosNotificacoes = await resNotificacoes.json();
        } catch (err) {
          console.error("Erro ao parsear JSON de notificações:", err);
          dadosNotificacoes = null;
        }

        console.log("Resposta /notificacoes:", dadosNotificacoes);

        let notificArray = [];
        if (Array.isArray(dadosNotificacoes)) {
          notificArray = dadosNotificacoes;
        } else if (dadosNotificacoes && typeof dadosNotificacoes === 'object') {
          notificArray = dadosNotificacoes.notificacoes ||
            dadosNotificacoes.data ||
            dadosNotificacoes.result ||
            [];
        }

        // Filtra notificações não vistas, considerando '0' ou 0
        const novas = notificArray.filter(n => n && Number(n.visualizado) === 0);
        setNotificacoes(novas);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchDados();
  }, [router]);

  // Filtra os 3 chamados pendentes mais recentes
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

  const aceitarChamado = async (idChamado) => {
    const token = localStorage.getItem("token");
    const config = {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    };
    try {
      const res = await fetch(`${API_URL}/chamados/assumir/${idChamado}`, config);
      if (!res.ok) throw new Error("Erro ao assumir chamado");

      setChamados(prev =>
        prev.map(c =>
          c.id === idChamado ? { ...c, status: "em andamento" } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <HeaderTecnico />
      <div className={styles.dashboardContainer}>
        <h2 className={styles.welcome}>Olá, {nomeUsuario}!</h2>
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
            <p className={styles.numeroNotificacoes}>{notificacoes.length}</p>
            <p className={styles.textoNotificacoes}>notificações novas</p>
          </div>
          <div className={styles.cardLarge}>
            <h3>Chamados pendentes mais recentes</h3>
            {chamadosRecentes.length === 0 ? (
              <p>Nenhum chamado pendente disponível</p>
            ) : (
              chamadosRecentes.map(c => (
                <div key={c.id} className={styles.chamadoItem}>
                  <div>
                    <h4>{c.titulo}</h4>
                    <p>{`Sala ${c.sala_id}`}</p>
                  </div>
                  <div>
                    <button className={styles.btnVerMais}>Ver mais</button>
                    <button
                      className={styles.btnAceitar}
                      onClick={() => aceitarChamado(c.id)}
                    >
                      Aceitar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.cardSmallBottom}>
            <ListaTarefa />
          </div>
        </div>
      </div>
    </div>
  );
}
