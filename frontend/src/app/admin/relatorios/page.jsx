"use client";
import { useEffect, useState } from "react";
import Relatorios from "@/components/Relatorios/relatorios";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import styles from "./page.module.css";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function PageRelatorios() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("chamados"); 

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          console.error('Nenhum token de autenticação encontrado.');
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/relatorios/chamados/relatorios", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: "include", 
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.mensagem || 'Erro na requisição da API.');
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setRelatorios(data);
        } else {
          console.error("A API retornou um formato inesperado:", data);
          setRelatorios([]);
        }
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err.message);
        setRelatorios([]); 

      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  return (
    <div className={styles.page}>
      <HeaderAdmin />
      <div className="container-fluid p-4">
        <div className={styles.tituloPrincipal}>
          <h1>Relatórios</h1>
        </div>

        <div className={styles.conteudoPrincipal}>
          <div className={styles.tabs}>
            <button onClick={() => setAbaAtiva("chamados")}>Chamados</button>
            <button onClick={() => setAbaAtiva("tecnicos")}>Técnicos</button>
            <button onClick={() => setAbaAtiva("equipamentos")}>Equipamentos</button>

          </div>
        </div>

        <div className={styles.todos}>
          {loading ? (
            <p>Carregando relatórios...</p>
          ) : relatorios.length === 0 ? (
            <p>Nenhum relatório encontrado</p>
          ) : (
            relatorios.map((relatorio) => (
              <Relatorios key={relatorio.id} relatorio={relatorio} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}