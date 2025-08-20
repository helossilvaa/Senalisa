"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function PerfilUsuario() {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080"; 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado.");
      setLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/usuario`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar dados do usuário");
        const data = await res.json();

        
        setDadosUsuario({
          nome: data.nome || "",
          funcao: data.funcao || "",
          status: data.status || "",
          senha: "********",
          email: data.email || "",
          criado: new Date(data.criado_em).toLocaleDateString() || "",
          atualizado: new Date(data.atualizado_em).toLocaleDateString() || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  if (loading) return <p className={styles.loading}>Carregando perfil...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!dadosUsuario) return null;

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}></div>
          <div className={styles.infoPrincipal}>
            <h2>{dadosUsuario.nome}</h2>
            <p>
              <strong>Atualizado:</strong> {dadosUsuario.atualizado}
            </p>
            <p>
              <strong>Criado:</strong> {dadosUsuario.criado}
            </p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div>
            <label className={styles.label}>Função</label>
            <div className={styles.inputLike}>{dadosUsuario.funcao}</div>
          </div>
          <div>
            <label className={styles.label}>Status</label>
            <div className={styles.inputLike}>{dadosUsuario.status}</div>
          </div>
          <div>
            <label className={styles.label}>Senha</label>
            <div className={styles.inputLike}>{dadosUsuario.senha}</div>
          </div>
        </div>

        <div className={styles.emailBox}>
          <label className={styles.label}>E-mail</label>
          <div className={styles.inputLike}>{dadosUsuario.email}</div>
        </div>
      </div>
    </main>
  );
}
