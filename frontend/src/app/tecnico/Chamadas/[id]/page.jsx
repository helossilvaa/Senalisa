"use client";

import * as React from "react";
import styles from "@/app/tecnico/Chamadas/[id]/page.module.css";
import HeaderTecnico from "@/components/HeaderTecnico/headerTecnico";
import CalendarPage from "@/components/Calendario/page";
import Relatorios from "@/components/Relatorios/relatorios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";

export default function InfoPage({ params }) {
  const id = params.id;
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [prazo, setPrazo] = useState(null); // Adicionado: Estado para armazenar a data do prazo
  const router = useRouter();
  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:8080";

  const [timelineItems, setTimelineItems] = useState([]);

  const dataInputRef = useRef(null);
  const tituloTextareaRef = useRef(null);

  useEffect(() => {
    if (id && typeof window !== 'undefined') {
      const savedItems = localStorage.getItem(`timelineData_${id}`);
      if (savedItems) {
        setTimelineItems(JSON.parse(savedItems));
      } else {
        setTimelineItems([]);
      }
    }
  }, [id]);

  useEffect(() => {
    if (id && typeof window !== 'undefined' && timelineItems.length > 0) {
      localStorage.setItem(`timelineData_${id}`, JSON.stringify(timelineItems));
    }
  }, [timelineItems, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newData = dataInputRef.current.value;
    const newTitulo = tituloTextareaRef.current.value;

    if (newData && newTitulo) {
      const newTimelineItem = {
        titulo: newTitulo,
        data: newData,
      };

      setTimelineItems((prevItems) => [...prevItems, newTimelineItem]);

      dataInputRef.current.value = '';
      tituloTextareaRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      alert("Seu login expirou.");
      router.push("/login");
      return;
    }

    const fetchChamado = async () => {
      try {
        const res = await fetch(`${API_URL}/chamados`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar chamado");
        const data = await res.json();
        setChamado(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamado();
  }, [id, router, token]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!chamado) {
    return <p>Chamado não encontrado.</p>;
  }

  return (
    <div className={styles.page}>
      <HeaderTecnico />
      <div className="container-fluid p-4">
        <div className={styles.conteudoPrincipal}>
          <div className={styles.infos}>
            <h3 className={styles.titulo}>Informações</h3>
            <div className={styles.card}>
              <h2 className={styles.tituloCard}>{chamado.titulo}</h2>
              <div className={styles.subInfo}>
                <p className={styles.autor}>{chamado.usuario}</p>
                <p className={styles.data}>{chamado.criado_em}</p>
              </div>
              <p className={styles.descricao}>
                {chamado.descricao}
              </p>
              <div className={styles.botoes}>
                {prazo && <p className={styles.prazoDisplay}>Prazo: {prazo}</p>}
                <button className={styles.emProgresso}>Aceitar</button>
              </div>
            </div>
          </div>

          <div className={styles.prazo}>
            <h3 className={styles.titulo}>Prazo</h3>
            <div className={styles.calendario}>
              {/* Passa a função de atualização do estado para o calendário */}
              <CalendarPage onDateSelect={setPrazo} />
            </div>
          </div>
        </div>

        <div className={styles.timelineContainer}>
          <div className={styles.linhaTempo}>
            <div className={styles.tituloLinhaTempo}>
              <p>Acompanhe a resolução do problema</p>
              <i
                className="bi bi-plus-circle"
                onClick={() => setMostrarForm(!mostrarForm)}
              />
            </div>

            <div className={styles.infosLinhaTempo}>
              {timelineItems.length > 0 ? (
                timelineItems.map((item, index) => (
                  <div key={index} className={styles.informacoesLinhaTempo}>
                    <span className={styles.ponto}></span>
                    <div>
                      <h4>{item.titulo}</h4>
                      <p className={styles.dataLinhaTempo}>{item.data}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.placeholder}>Nenhum item na linha do tempo. Adicione um para começar!</p>
              )}
            </div>
          </div>

          {mostrarForm && (
            <form className={styles.formTimeline} onSubmit={handleSubmit}>
              <label>Data</label>
              <input
                type="text"
                placeholder="Digite a data"
                ref={dataInputRef}
              />
              <label>Título</label>
              <textarea
                placeholder="Digite o título"
                ref={tituloTextareaRef}
              ></textarea>
              <button type="submit" className={styles.btnEnviar}>
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}