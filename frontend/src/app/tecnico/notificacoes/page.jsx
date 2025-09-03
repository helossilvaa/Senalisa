'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from '@/components/Header/header';
import { SidebarProvider } from '@/components/Header/sidebarContext';
import "/page.module.css";

// Componente de Avaliação
function Avaliacao({ chamadoId, onAvaliacaoEnviada }) {
  const [pontuacao, setPontuacao] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const enviarAvaliacao = async () => {
    try {
      setLoading(true);
      setErro(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/chamados/${chamadoId}/avaliar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chamado_id: chamadoId, pontuacao, comentario })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mensagem || 'Erro ao enviar avaliação');
      }

      setLoading(false);
      onAvaliacaoEnviada();
    } catch (err) {
      console.error(err);
      setErro(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="avaliacao mt-3">
      <h6>Avaliar Chamado</h6>
      <div className="mb-2">
        <label>Pontuação:</label>
        <select
          className="form-select"
          value={pontuacao}
          onChange={e => setPontuacao(Number(e.target.value))}
        >
          <option value={0}>Selecione...</option>
          <option value={1}>1 - Péssimo</option>
          <option value={2}>2 - Ruim</option>
          <option value={3}>3 - Regular</option>
          <option value={4}>4 - Bom</option>
          <option value={5}>5 - Excelente</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Comentário (opcional):</label>
        <textarea
          className="form-control"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          rows={3}
        ></textarea>
      </div>
      {erro && <p className="text-danger">{erro}</p>}
      <button className="btn btn-primary" onClick={enviarAvaliacao} disabled={loading || pontuacao === 0}>
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </div>
  );
}

export default function Notificacoes() {
  const [selected, setSelected] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/"); 
          return;
        }

        const res = await fetch(`${API_URL}/notificacoes`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar notificações');

        const data = await res.json();
        setNotifications(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro:", err);
        setError("Erro ao carregar notificações. Tente novamente mais tarde.");
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  const handleNotificationClick = async (notification) => {
    setSelected({ ...notification, visualizado: 1 });
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, visualizado: 1 } : n)
    );

    if (notification.visualizado === 1) return;

    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${API_URL}/notificacoes/${notification.id}/marcarvista`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao marcar notificação como vista');
    } catch (error) {
      console.error("Erro ao marcar notificação como vista:", error);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, visualizado: 0 } : n)
      );
      setSelected(notification);
    }
  };

  return (
    <SidebarProvider>
      <div className="container-fluid vh-100">
        <div className="row h-100">
          <Header />
          <main className="col p-4 d-flex flex-column flex-md-row gap-4" >
            <div className="card" >
              <div className="card-body" >
                <h1 className="card-title mb-3">Notificações</h1>
                <ul className="list-group list-group-flush">
                  {isLoading ? (
                    <p className="text-muted text-center mt-3">Carregando notificações...</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-muted text-center mt-3">Nenhuma notificação por enquanto.</p>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className="list-group-item d-flex align-items-center justify-content-between notification-item" style={{ marginTop: '10px' }}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div>
                          <p className="mb-1 fw-semibold">{n.mensagem}</p>
                        </div>
                        {n.visualizado === 0 && <span className="badge bg-danger rounded-circle p-2"></span>}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {selected && (
              <div className="card shadow-sm flex-grow-1 rounded-4 animate__animated animate__fadeInRight drawer-card">
                <div
                  className="card-header d-flex justify-content-between align-items-center text-white rounded-top-4"
                  style={{ backgroundColor: '#b10000', height: '60px' }}
                >
                  <h6 className="mb-0">Detalhes da Notificação</h6>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setSelected(null)}
                  ></button>
                </div>
                <div className="card-body">
                  <p><b>Mensagem:</b> {selected.mensagem}</p>

                  {/* Renderiza avaliação se for chamado concluído */}
                  {selected.chamado_id && selected.mensagem.includes('foi concluído') && (
                    <Avaliacao
                      chamadoId={selected.chamado_id}
                      onAvaliacaoEnviada={() => setSelected(null)}
                    />
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div >
    </SidebarProvider>
  );
}
