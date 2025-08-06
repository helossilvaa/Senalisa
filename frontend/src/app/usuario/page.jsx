import Image from "next/image";
// import styles from "./page.module.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import './home.css';

export default function Home() {
  
  return (
    <>
      {/* <div className="flex w-screen h-screen">
        <div
          className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
          style={{ width: 280 }}
        >
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <svg
              className="bi pe-none me-2"
              width={40}
              height={32}
              aria-hidden="true"
            >
              <use xlinkHref="#bootstrap" />
            </svg>

            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="me-2"
            />
          </a>

          <hr />

          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a href="#" className="nav-link active" aria-current="page">
                <svg
                  className="bi pe-none me-2"
                  width={16}
                  height={16}
                  aria-hidden="true"
                >
                  <use xlinkHref="#home" />
                </svg>
                <i class="bi bi-speedometer2"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg
                  className="bi pe-none me-2"
                  width={16}
                  height={16}
                  aria-hidden="true"
                >
                  <use xlinkHref="#speedometer2" />
                </svg>
                <i class="bi bi-bell"></i> Notificações
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg
                  className="bi pe-none me-2"
                  width={16}
                  height={16}
                  aria-hidden="true"
                >
                  <use xlinkHref="#table" />
                </svg>
                <i class="bi bi-chat-left-text"></i> Conversas
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg
                  className="bi pe-none me-2"
                  width={16}
                  height={16}
                  aria-hidden="true"
                >
                  <use xlinkHref="#grid" />
                </svg>
                <i class="bi bi-exclamation-circle-fill"></i> Chamados 
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg
                  className="bi pe-none me-2"
                  width={16}
                  height={16}
                  aria-hidden="true"
                >
                  <use xlinkHref="#people-circle" />
                </svg>
                <i class="bi bi-person-fill"></i> Novo chamado
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg
                  className="bi pe-none me-2"
                  width={16}
                  height={16}
                  aria-hidden="true"
                >
                  <use xlinkHref="#people-circle" />
                </svg>
                <i class="bi bi-clock"></i> Histórico
              </a>
            </li>
          </ul>

          <hr />
        </div>
      </div> */}
    </>
  );
}
