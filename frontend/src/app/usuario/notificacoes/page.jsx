'use client'
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header/header';
import "./notificacoes.css";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";


export default function NotificacoesPage() { 

    const [notificacoes, setNotificacoes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const API_URL = 'http://localhost:8080';

    useEffect(() => {
        const fetchNotificacoes = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const decoded = jwtDecode(token);

                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token");
                    alert('Seu Login expirou.');
                    router.push("/login");
                    return;
                }

                const usuarioId = decoded.id;

                // Faz a chamada à API para listar as notificações do usuário
                const response = await fetch(`${API_URL}/notificacoes/usuarios/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar notificações.');
                }
                
                const data = await response.json();
                setNotificacoes(data);

            } catch (error) {
                console.error("Erro ao carregar notificações:", error);
                // Você pode adicionar uma mensagem de erro na UI
            } finally {
                setLoading(false);
            }
        };

        fetchNotificacoes();

    }, [router]); // Adicionado router como dependência

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <Header />
                <main className="col p-4 d-flex flex-column flex-md-row gap-4">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title mb-3">Notificações</h1>
                            <ul className="list-group list-group-flush">
                                {/* Mapeia sobre o estado `notificacoes` em vez da lista estática */}
                                {notificacoes.map((n) => (
                                    <li
                                        key={n.id}
                                        className="list-group-item d-flex align-items-center justify-content-between notification-item"
                                        style={{ marginTop: '10px' }}
                                        onClick={() => setSelected(n)}
                                    >
                                        <div>
                                            {/* O título da notificação virá da API */}
                                            <p className="mb-1 fw-semibold">{n.mensagem}</p> 
                                            <small className="text-muted">
                                                {new Date(n.criadoEm).toLocaleTimeString()} |
                                                {new Date(n.criadoEm).toLocaleDateString()}
                                            </small>
                                        </div>
                                        {/* Exibe o badge se a notificação não foi visualizada */}
                                        {n.visualizado === 'nao_vista' && (
                                            <span className="badge bg-danger rounded-circle p-2"></span>
                                        )}
                                    </li>
                                ))}
                                {loading && <p>Carregando notificações...</p>}
                                {!loading && notificacoes.length === 0 && <p>Nenhuma notificação encontrada.</p>}
                            </ul>
                        </div>
                    </div>
                    {selected && (
                        <div className="card shadow-sm flex-grow-1 rounded-4 animate__animated animate__fadeInRight drawer-card">
                            <div className="card-header d-flex justify-content-between align-items-center text-white rounded-top-4"
                                style={{ backgroundColor: '#b10000', height: '60px' }}>
                                <h6 className="mb-0">{selected.mensagem}</h6>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setSelected(null)}>
                                </button>
                            </div>
                            <div className="card-body">
                                <p><b>Data:</b> {new Date(selected.criadoEm).toLocaleDateString()} às {new Date(selected.criadoEm).toLocaleTimeString()}</p>
                                {/* O campo `details` não existe na sua API. Usando `mensagem` */}
                                <p>{selected.mensagem}</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div >
    );
}