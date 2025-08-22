'use client';
import { useEffect } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import './header.css';

export default function Home() {

    useEffect(() => {

        const button = document.getElementById('open_btn');
        const sidebar = document.getElementById('sidebar');

        const handleClick = () => {
            sidebar.classList.toggle('open-sidebar');
        };

        if (button) {
            button.addEventListener('click', handleClick);
        }
        return () => {
            if (button) {
                button.removeEventListener('click', handleClick);
            }
        };

    }, []);

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />

            <nav id="sidebar">
                <div id="sidebar_content">
                    <div className="senaiLogo">
                        <img src="/Senalisa.png" className="logo logoExpandida" alt="Logo" />
                        <img src="/logoMenor.png" className="logo logoColapsada" alt="Simples Logo" />
                    </div>
                    {/* <hr /> */}
                    <ul id="side_items">
                        <li className="side-item active mt-4">
                            <a href="#">
                                <i className="bi bi-speedometer2 me-2" />
                                <span className="item-description">Dashboard</span>
                            </a>
                        </li>
                        <li className="side-item">
                            <a href="#">
                                <i className="bi bi-bell me-2" />
                                <span className="item-description">Notificações</span>
                            </a>
                        </li>
                        <li className="side-item">
                            <a href="#">
                                <i className="bi bi-chat-left-text me-2" />
                                <span className="item-description">Conversas</span>
                            </a>
                        </li>
                        <li className="side-item">
                            <a href="#">
                                <i className="bi bi-exclamation-circle-fill me-2" />
                                <span className="item-description">Chamados</span>
                            </a>
                        </li>
                        <li className="side-item">
                            <a href="#">
                                <i className="bi bi-person-fill me-2" />
                                <span className="item-description">Novo chamado</span>
                            </a>
                        </li>
                        <li className="side-item">
                            <a href="#">
                                <i className="bi bi-clock me-2" />
                                <span className="item-description">Histórico</span>
                            </a>
                        </li>
                    </ul>
                    <button id="open_btn">
                        <i id="open_btn_icon" className="fa-solid fa-chevron-right" />
                    </button>

                    <div id="logout" className='d-flex p-2 align-items-center mt-2'>
                        <button id="logout_btn">
                            <i className="bi bi-person-fill" />
                            <span className="item-description">Perfil</span>
                        </button>
                        <button id="logout_btn">
                            <i className="text-danger bi bi-box-arrow-right" />
                            <span className="text-danger item-description">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

        </>
    );
}