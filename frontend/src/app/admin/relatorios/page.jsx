"use client";
import { useState, useRef, useEffect } from "react";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Relatorios from "@/components/Relatorios/relatorios";

export default function RelatoriosPage() {
  const [active, setActive] = useState(0);
  const [lineStyle, setLineStyle] = useState({});
  const router = useRouter();
  const refs = [useRef(null), useRef(null), useRef(null)];
  const [chamadosConcluidos, setChamadosConcluidos] = useState([]);
  const [selectedChamado, setSelectedChamado] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRelatorio, setGeneratedRelatorio] = useState(null); // Novo estado

  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const current = refs[active].current;
    if (current) {
      setLineStyle({
        width: current.offsetWidth + "px",
        left: current.offsetLeft + "px",
      });
    }
  }, [active]);

  useEffect(() => {
    const fetchChamadosConcluidos = async () => {
      try {
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

        const res = await fetch(`${API_URL}/chamados/historico`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar chamados concluídos");
        }

        const data = await res.json();
        setChamadosConcluidos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChamadosConcluidos();
  }, [router]);
  const handleGerarPdf = async () => {
    if (!selectedChamado) {
      alert("Por favor, selecione um chamado.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/relatorios/pdf/${selectedChamado}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const data = await res.json();
      const nomeDoArquivo = data.arquivo;

      // Encontre o chamado correspondente e atualize o estado
      const chamadoGerado = chamadosConcluidos.find(c => c.id === selectedChamado);
      if (chamadoGerado) {
        setGeneratedRelatorio({
          ...data,
          chamado: chamadoGerado,
        });
      }

      window.open(`${API_URL}/relatorios/pdfs/${nomeDoArquivo}`, '_blank');

    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <HeaderAdmin />
      <div className="container-fluid p-4">
        <div className={styles.tituloPrincipal}>
          <h1>Relatórios</h1>
        </div>
        
        <div className={styles.conteudoPrincipal}>
            <div className={styles.gerarPdfContainer}>
              <h3>Gerar PDF de um chamado concluído</h3>
              <select
                className={styles.chamadoSelect}
                value={selectedChamado}
                onChange={(e) => setSelectedChamado(e.target.value)}
              >
                <option value="">Selecione um chamado</option>
                {chamadosConcluidos.map((chamado) => (
                  <option key={chamado.id} value={chamado.id}>
                    {`#${chamado.id} - ${chamado.titulo}`}
                  </option>
                ))}
              </select>
              <button
                className={styles.gerarPdfButton}
                onClick={handleGerarPdf}
                disabled={loading || !selectedChamado}
              >
                {loading ? 'Gerando...' : 'Gerar PDF'}
              </button>
            </div>
            
            {/* Renderização condicional do componente Relatorios */}
            {generatedRelatorio && (
              <div className={styles.relatorioGerado}>
                <h4>Relatório Gerado:</h4>
                <Relatorios relatorio={generatedRelatorio} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}