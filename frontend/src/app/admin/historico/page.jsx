"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./historico.module.css";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";

export default function Informacoes() {
  const [active, setActive] = useState(0);
  const [lineStyle, setLineStyle] = useState({});
  const refs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const current = refs[active].current;
    if (current) {
      setLineStyle({
        width: current.offsetWidth + "px",
        left: current.offsetLeft + "px",
      });
    }
  }, [active]);

  return (
    <div className={styles.page}>
      <HeaderAdmin />

      <div className="container-fluid p-4">
        <div className={styles.tituloPrincipal}>
          <h1>Histórico</h1>
        </div>

        {/* Tabs */}
        <div className={styles.conteudoPrincipal}>
          <div className={styles.tabs}>
            <button ref={refs[0]} onClick={() => setActive(0)}>
              Novos Chamados
            </button>
            <button ref={refs[1]} onClick={() => setActive(1)}>
              Chamados Pendentes
            </button>
            <button ref={refs[2]} onClick={() => setActive(2)}>
              Chamados Concluídos
            </button>
            <span className={styles.line} style={lineStyle}></span>
          </div>
        </div>

        <div className={styles.todos}>
          <div className={styles.selecao}>
            <h3>
              {active === 0 && "Listando Novos Chamados..."}
              {active === 1 && "Listando Chamados Pendentes..."}
              {active === 2 && "Listando Chamados Concluídos..."}
            </h3>
          </div>
        </div>
      </div>
    
    </div>

    );
}