'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card/Card';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import styles from './page.module.css';

export default function MeusChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchChamados = async () => {
      try {
        const res = await fetch("http://localhost:8080/chamados/meuschamados", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Erro ao buscar chamados");

        const data = await res.json();
        setChamados(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar chamados");
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, [router]);

  if (loading) return <p>Carregando chamados...</p>;

  return (
    <div className={styles.container}>
      <HeaderTecnico />
      <div className={styles.chamadas}>
        <h1>Meus Chamados</h1>
        <div className={styles.card}>
          {chamados.length === 0 ? (
            <p>Nenhum chamado aceito ainda.</p>
          ) : (
            chamados.map(chamado => (
              <Card
                key={chamado.id}
                id={chamado.id}
                titulo={chamado.titulo}
                data={new Date(chamado.atualizado_em).toLocaleDateString()}
                mostrarBotaoAceitar={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
