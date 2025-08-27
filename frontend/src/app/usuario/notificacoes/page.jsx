'use client'
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header/header';
import "./notificacoes.css";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";


export default function App() {

    const [notificacoes, setNotificacoes] = useState([]);
    const [selected, setSelected] = useState(null);

     const router = useRouter();
     const API_URL = 'http://localhost:8080';


     useEffect(()=> {

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

        const id = decoded.id;

      fetch(`${API_URL}/usuarios/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .catch(err => {
          console.error("Erro ao buscar usuário: ", err);
        });

    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }


});
    

    const notifications = [
        {
            id: 1,
            title: "Chamada 12345 aberta",
            time: "10:55",
            date: "10 de setembro",
            details: "A chamada número 12345 foi aberta para o setor de TI."
        },
        {
            id: 2,
            title: "Junior enviou uma mensagem!",
            time: "10:55",
            date: "10 de setembro",
            details: "O técnico Junior respondeu sua solicitação. Verifique a conversa."
        },
        {
            id: 3,
            title: "Avalie o atendimento!",
            time: "10:55",
            date: "10 de setembro",
            details: "Por favor, avalie a qualidade do atendimento prestado."
        },
        {
            id: 4,
            title: "Chamada 12345 aberta",
            time: "10:55",
            date: "10 de setembro",
            details: "A chamada número 12345 continua em aberto aguardando solução."
        }
    ];

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <Header />


                <main className="col p-4 d-flex flex-column flex-md-row gap-4" >


                <div className="card" >
                    <div className="card-body" >
                        <h1 className="card-title mb-3"> Notificações</h1>
                        <ul className="list-group list-group-flush">
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className="list-group-item d-flex align-items-center justify-content-between notification-item" style={{ marginTop: '10px' }}
                                    onClick={() => setSelected(n)}
                                >
                                    <div>
                                        <p className="mb-1 fw-semibold">{n.title}</p>
                                        <small className="text-muted">{n.time} | {n.date}</small>
                                    </div>
                                    <span className="badge bg-danger rounded-circle p-2"></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                {selected && (
                    <div className="card shadow-sm flex-grow-1 rounded-4 animate__animated animate__fadeInRight drawer-card" >
                        <div className="card-header d-flex justify-content-between align-items-center text-white rounded-top-4"
                            style={{ backgroundColor: '#b10000', height: '60px' }}>
                            <h6 className="mb-0">{selected.title}</h6>
                            <button
                                className="btn-close btn-close-white"
                                onClick={() => setSelected(null)}>
                            </button>
                        </div>
                        <div className="card-body">
                            <p><b>Data:</b> {selected.date} às {selected.time}</p>
                            <p>{selected.details}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    </div >
  );
}
