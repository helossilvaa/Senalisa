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

  const normalizar = (s) =>
    s?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDados = async () => {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          alert("Seu login expirou.");
          router.push("/login");
          return;
        }

        setNomeUsuario(decoded.nome || 'Usuário não encontrado');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const resTecnico = await fetch(`${API_URL}/chamados/chamadoseutecnico`, config);
        const chamadosTecnico = resTecnico.ok ? await resTecnico.json() : [];

        const resPendentes = await fetch(`${API_URL}/chamados/pendentes`, config);
        const chamadosPendentes = resPendentes.ok ? await resPendentes.json() : [];

        const resConcluidos = await fetch(`${API_URL}/chamados/concluidos`, config);
        const chamadosConcluidos = resConcluidos.ok ? await resConcluidos.json() : [];

        console.log("Tecnico:", chamadosTecnico.length);
        console.log("Pendentes:", chamadosPendentes.length);
        console.log("Concluídos:", chamadosConcluidos.length);

        const mapChamados = new Map();
        [...chamadosTecnico, ...chamadosPendentes, ...chamadosConcluidos].forEach(c => {
          if (c && c.id != null && !mapChamados.has(c.id)) {
            mapChamados.set(c.id, c);
          }
        });
        const todosChamados = Array.from(mapChamados.values());
        setChamados(todosChamados);

        const resNotificacoes = await fetch(`${API_URL}/notificacoes`, config);
        if (!resNotificacoes.ok) {
          setNotificacoes([]);
          return;
        }
        let dadosNotificacoes = await resNotificacoes.json();
        let notificArray = Array.isArray(dadosNotificacoes)
          ? dadosNotificacoes
          : (dadosNotificacoes.notificacoes ||
            dadosNotificacoes.data ||
            dadosNotificacoes.result ||
            []);
        const novas = notificArray.filter(n => n && Number(n.visualizado) === 0);
        setNotificacoes(novas);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchDados();
  }, [router]);

  const chamadosRecentes = chamados
    .filter(c => normalizar(c.status) === "pendente")
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 3);

  const totalChamados = chamados.length;
  const statusCounts = {
    "em andamento": chamados.filter(c => normalizar(c.status) === "em andamento").length,
    "concluído": chamados.filter(c => normalizar(c.status) === "concluído").length,
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
            <h3>Status dos seus chamados:</h3>
            <p className={styles.numeroChamados}>{totalChamados}</p>
            <div className={styles.barraProgresso}>
              {totalChamados > 0 && statusCounts["em andamento"] > 0 && (
                <div
                  className={styles.progressoEmAndamento}
                  style={{ width: `${(statusCounts["em andamento"] / totalChamados) * 100}%` }}
                />
              )}
              {totalChamados > 0 && statusCounts["concluído"] > 0 && (
                <div
                  className={styles.progressoFinalizado}
                  style={{ width: `${(statusCounts["concluído"] / totalChamados) * 100}%` }}
                />
              )}
            </div>
            <ul className={styles.legenda}>
              <li><span className={styles.bolinhaAndamento}></span> Em andamento ({statusCounts["em andamento"]})</li>
              <li><span className={styles.bolinhaFinalizado}></span> Concluído ({statusCounts["concluído"]})</li>
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