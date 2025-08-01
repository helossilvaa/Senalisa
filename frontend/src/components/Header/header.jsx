// 'use client';
import "bootstrap-icons/font/bootstrap-icons.css";
import './header.css';

export default function Home() {
    return (
        <>
            <div className="d-flex">
                <div
                    className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark "
                    style={{ width: "250px"}}
                >
                    <img
                        src="/Senalisa.png"
                        alt="Logo"
                        width={150}
                        height={65}
                        className="mb-3 align-self-center"
                        style={{ marginTop: "10px" }}
                    />

                    <hr />

                    <ul className="nav mb-auto p-2">
                        <li className="listaSidebar">
                            <a href="#" className="p-3 nav-link text-white " >
                                <i className="bi bi-speedometer2 me-2"></i> Dashboard
                            </a>
                        </li>
                        <li className="listaSidebar">
                            <a href="#" className="p-3 nav-link text-white">
                                <i className="bi bi-bell me-2"></i> Notificações
                            </a>
                        </li>
                        <li className="listaSidebar">
                            <a href="#" className="p-3 nav-link text-white">
                                <i className="bi bi-chat-left-text me-2"></i> Conversas
                            </a>
                        </li>
                        <li className="listaSidebar">
                            <a href="#" className="p-3 nav-link text-white">
                                <i className="bi bi-exclamation-circle-fill me-2"></i> Chamados
                            </a>
                        </li>
                        <li className="listaSidebar">
                            <a href="#" className="p-3 nav-link text-white">
                                <i className="bi bi-person-fill me-2"></i> Novo chamado
                            </a>
                        </li>
                        <li className="listaSidebar">
                            <a href="#" className="p-3 nav-link text-white">
                                <i className="bi bi-clock me-2"></i> Histórico
                            </a>
                        </li>
                    </ul>


                    <ul className="mt-5 nav flex-column mb-auto p-3">
                        <li className="nav-item">
                            <a href="#" className="p-2 nav-link text-white">
                                <i className="bi bi-person-fill"></i> Perfil
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="p-2 nav-link text-danger">
                                <i className="bi bi-box-arrow-right"></i> Sair
                            </a>
                        </li>
                    </ul>
                    <hr />
                </div>

                {/* Aqui pode vir o conteúdo principal do app */}
                <div className="flex-grow-1 p-4">
                    {/* Conteúdo principal */}
                </div>
            </div>
        </>
    );
}
