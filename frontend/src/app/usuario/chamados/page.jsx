'use client';
import './chamados.css';
import { useState, useEffect } from 'react';
import Header from '@/components/Header/header';

export default function Chamados() {
  const [filtro, setFiltro] = useState("Todas");
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8080'; 

  // Buscar chamados do backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchChamados = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/chamados`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erro ao buscar chamados');
        const data = await res.json();
        setChamados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  // Filtra chamados de acordo com o status
  const chamadosFiltrados = chamados.filter((chamado) => {
    if (filtro === "Todas") return true;
    return chamado.status.toLowerCase() === filtro.toLowerCase();
  });

  return (
    <div className="d-flex">
      <Header />

      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-5">Chamados</h2>

        {/* Abas */}
        <div className="tabs mb-3 d-flex gap-4">
          {["Todas", "Em progresso", "Finalizado"].map((tab) => (
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

        {/* Mensagem de erro ou loading */}
        {loading && <p>Carregando chamados...</p>}
        {error && <p className="text-danger">{error}</p>}

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
                  <tr><td colSpan="5" className="text-center text-muted">Nenhum chamado encontrado.</td></tr>
                ) : (
                  chamadosFiltrados.map((chamado) => (
                    <tr key={chamado.id}>
                      <td>{chamado.id}</td>
                      <td>{chamado.titulo}</td>
                      <td>{chamado.tecnico_nome || '-'}</td>
                      <td>{new Date(chamado.created_at).toLocaleDateString()}</td>
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
  );
}
