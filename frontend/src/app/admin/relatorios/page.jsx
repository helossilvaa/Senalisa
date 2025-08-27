"use client";
import { useState, useRef, useEffect } from "react";
import Relatorios from "@/components/Relatorios/relatorios";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import styles from "./page.module.css";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function HistoricoRelatorios() {
  const [active, setActive] = useState(0);
  const [lineStyle, setLineStyle] = useState({});
  const refs = [useRef(null), useRef(null), useRef(null)];
  const [relatorios, setRelatorios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  const API_URL = "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
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

    const fetchRelatorios = async () => {
      try {
        const res = await fetch(`${API_URL}/relatorios`, {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
    
        if (!res.ok) {
          const text = await res.text();
          console.error("Status:", res.status, "Resposta:", text);
          throw new Error(text || "Erro ao buscar relatórios");
        }
    
        const data = await res.json();
        setRelatorios(data);
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
        setError("Não foi possível carregar os relatórios.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, [router]);

  return (
    <div className={styles.page}>
      <HeaderAdmin />
      <div className="container-fluid p-4">
        <div className={styles.tituloPrincipal}>
          <h1>Relatórios</h1>
        </div>

        <div className={styles.conteudoPrincipal}>
          <div className={styles.tabs}>
            <button ref={refs[0]} onClick={() => setActive(0)}>
              Chamados
            </button>
            <button ref={refs[1]} onClick={() => setActive(1)}>
              Técnicos
            </button>
            <button ref={refs[2]} onClick={() => setActive(2)}>
              Objetos Quebrados
            </button>
            <span className={styles.line} style={lineStyle}></span>
          </div>
        </div>

        <div className={styles.todos}>
          <div className={styles.selecao}>
            {loading ? (
              <p>Carregando relatórios...</p>
            ) : error ? (
              <p style={{ color: "#640d14" }}>{error}</p>
            ) : relatorios.length > 0 ? (
              relatorios.map((r) => <Relatorios key={r.id} relatorio={r} activeTab={active} />)
            ) : (
              <p>Nenhum relatório encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}