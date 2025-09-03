"use client";

import { useEffect, useState } from "react";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import CardAdmin from "@/components/CardAdmin/page";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ChamadosAdmin() {
  const [chamados, setChamados] = useState([]);
  const [pools, setPools] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [selectedPool, setSelectedPool] = useState("");
  const [loading, setLoading] = useState(true);
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

    const fetchData = async () => {
      try {
        setLoading(true);
        const chamadosRes = await fetch(`${API_URL}/chamados`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const poolsRes = await fetch(`${API_URL}/pools`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tecnicosRes = await fetch(`${API_URL}/usuarios/tecnicosPools`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!chamadosRes.ok || !poolsRes.ok || !tecnicosRes.ok) {
          throw new Error("Erro ao buscar dados.");
        }

        const chamadosData = await chamadosRes.json();
        const poolsData = await poolsRes.json();
        const tecnicosData = await tecnicosRes.json();

        console.log("Chamados:", chamadosData);
        console.log("Pools:", poolsData);
        console.log("Técnicos:", tecnicosData);

        setChamados(chamadosData);
        setPools(poolsData);
        setTecnicos(tecnicosData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const atribuirChamado = async (chamadoId, tecnicoId) => {
    const token = localStorage.getItem("token");

    // Adicione a conversão do ID para número aqui
    const tecnicoIdNumerico = parseInt(tecnicoId, 10);
    if (isNaN(tecnicoIdNumerico)) {
      alert("Erro: ID do técnico inválido.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/chamados/${chamadoId}/atribuir`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Envie o valor numérico na requisição
        body: JSON.stringify({ tecnicoId: tecnicoIdNumerico }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atribuir chamado.");
      }

      setChamados((prev) =>
        prev.map((c) =>
          c.id === chamadoId ? { ...c, tecnico_id: tecnicoIdNumerico, status: "em andamento" } : c
        )
      );
      alert("Chamado atribuído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Falha ao atribuir chamado.");
    }
  };

  const chamadosFiltrados = selectedPool
    ? chamados.filter((chamado) => chamado.tipo_id === parseInt(selectedPool, 10))
    : chamados;

  if (loading) return <p>Carregando chamados...</p>;

  return (
    <div className={styles.container}>
      <HeaderAdmin />
      <div className={styles.chamados}>
        <h1>Gerenciamento de Chamados</h1>

        <div className={styles.filterContainer}>
          <label htmlFor="pool-filter">Filtrar por Pool:</label>
          <select
            id="pool-filter"
            value={selectedPool}
            onChange={(e) => setSelectedPool(e.target.value)}
          >
            <option value="">Todos os Pools</option>
            {pools.map((pool) => (
              <option key={pool.id} value={pool.id}>
                {pool.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.cardList}>
          {chamadosFiltrados.length === 0 ? (
            <p>Nenhum chamado encontrado.</p>
          ) : (
            chamadosFiltrados.map((chamado) => {
              const tecnicosDoPool = tecnicos.filter(tecnico =>
                tecnico.pools?.some(pool => pool.id === chamado.tipo_id)
              );

              return (
                <CardAdmin
                  key={chamado.id}
                  id={chamado.id}
                  titulo={chamado.titulo}
                  data={chamado.criado_em}
                  tecnicos={tecnicosDoPool}
                  onAtribuir={atribuirChamado}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}