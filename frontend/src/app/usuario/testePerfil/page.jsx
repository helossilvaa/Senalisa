"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function PerfilUsuario() {
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "Isabella Nunes",
    funcao: "Professora",
    status: "Ativo",
    senha: "********",
    email: "isabellanunespaula@gmail.com",
    criado: "11/09/2024",
    atualizado: "11/09/2024",
  });

  // Pronto para receber dados do backend futuramente
  useEffect(() => {
    // fetch('/api/usuario').then(...).then(setDadosUsuario)
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}></div>
          <div className={styles.infoPrincipal}>
            <h2>{dadosUsuario.nome}</h2>
            <p><strong>Atualizado:</strong> {dadosUsuario.atualizado}</p>
            <p><strong>Criado:</strong> {dadosUsuario.criado}</p>
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
