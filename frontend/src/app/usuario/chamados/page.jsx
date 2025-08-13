'use client';
import './chamados.css';
import { useState } from 'react';
import Header from '@/components/Header/header';

export default function Chamados() {
  const [filtro, setFiltro] = useState("Todas");

  const chamados = [
    { id: 1, numero: "12345", item: "Notebook", tecnico: "Junior", data: "30/07", status: "Finalizado" },
    { id: 2, numero: "12346", item: "Impressora", tecnico: "Maria", data: "01/08", status: "Em progresso" },
    { id: 3, numero: "12347", item: "Monitor", tecnico: "Carlos", data: "02/08", status: "Finalizado" }
  ];

  // Filtro dinâmico
  const chamadosFiltrados = chamados.filter((chamado) => {
    if (filtro === "Todas") return true;
    return chamado.status === filtro;
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

        {/* Tabela */}
        <div className="table-responsive">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Número do chamado</th>
                <th>Item</th>
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
                    <td>{chamado.numero}</td>
                    <td>{chamado.item}</td>
                    <td>{chamado.tecnico}</td>
                    <td>{chamado.data}</td>
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
      </div>
    </div>
  );
}
