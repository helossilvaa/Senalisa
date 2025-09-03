'use client';
import './chamados.css';
import { useState, useEffect } from 'react';
import Header from '@/components/Header/header';
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { SidebarProvider } from '@/components/Header/sidebarContext'

export default function Chamados() {
  const [filtro, setFiltro] = useState("Todas");
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchChamados = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          alert('Seu Login expirou.');
          router.push("/login");
          return;
        }

        
        const res = await fetch(`${API_URL}/chamados/chamados`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Erro ao buscar chamados');

        const data = await res.json();
        setChamados(data);

        
        if (data.some(c => c.status.toLowerCase() === 'concluído')) {
          setFiltro('concluído');
        } else if (data.some(c => c.status.toLowerCase() === 'em andamento')) {
          setFiltro('em andamento');
        } else {
          setFiltro('Todas');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  
  const chamadosFiltrados = chamados.filter((chamado) => {
    if (filtro === "Todas") return true;
    return chamado.status.toLowerCase() === filtro.toLowerCase();
  });

  return (
    <SidebarProvider>
    <div className="d-flex">
      <Header />

      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-5">Meus Chamados</h2>

        {/* Abas */}
        <div className="tabs mb-3 d-flex gap-4">
          {["Todas", "em andamento", "concluído"].map((tab) => (
            <a
              key={tab}
              href="#"
              className={`tab ${filtro === tab ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setFiltro(tab);
              }}
            >
              {tab}
            </a>
          ))}
        </div>
        <hr />

        {/* Tabela */}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Número do chamado</th>
                  <th>Título</th>
                  <th>Técnico resp.</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>
                ) : (
                  chamadosFiltrados.map((chamado) => (
                    <tr key={chamado.id}>
                      <td>{chamado.id}</td>
                      <td>{chamado.titulo}</td>
                      <td>{chamado.tecnico_nome || '-'}</td>
                      <td>{new Date(chamado.criado_em).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${chamado.status.toLowerCase().replace(" ", "-")}`}>
                          {chamado.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </SidebarProvider>
  );
}
