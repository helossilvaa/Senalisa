"use client";

import { useState, useRef, useEffect } from "react";
import Relatorios from "@/components/Relatorios/relatorios";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import styles from "./page.module.css"

export default function () {
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
    
    return(
        <div className={styles.page}>
        <HeaderAdmin/>
        <div className="container-fluid p-4">
        <div className={styles.tituloPrincipal}>
          <h1>Relatórios</h1>
        </div>

        <div className={styles.conteudoPrincipal}>
          <div className={styles.tabs}>
            <button ref={refs[0]} onClick={() => setActive(0)}>Chamados</button>
            <button ref={refs[1]} onClick={() => setActive(1)}>Técnicos</button>
            <button ref={refs[2]} onClick={() => setActive(2)}>Objetos Quebrados</button>
            <span className={styles.line} style={lineStyle}></span>
          </div>
        </div>

        <div className={styles.todos}>
          <div className={styles.selecao}>
            <h3>
              {active === 0 && "Listando Relatórios dos Chamados..."}
              {active === 1 && "Listando Relatórios dos Técnicos..."}
              {active === 2 && "Listando Relatórios dos Objetos Quebrados..."}
            </h3>
          </div>
        </div>
      </div>
        </div>
    )
}

