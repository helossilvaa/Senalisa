// pages/404.jsx
"use client";

import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();

  const handleGoDashboard = () => {
    const tipoUsuario = localStorage.getItem("tipoUsuario"); // "adm", "usuario", "tecnico"

    switch (tipoUsuario) {
      case "adm":
        router.push("/admin/dashboard");
        break;
      case "usuario":
        router.push("/usuario/dashboard");
        break;
      case "tecnico":
        router.push("/tecnico/dashboard");
        break;
      default:
        router.push("/"); // Caso não esteja logado
        break;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <h1 style={{ fontSize: "8rem", margin: 0, color: "#c00000" }}>404</h1>
      <h2 style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>Página não encontrada</h2>
      <p style={{ fontSize: "1.2rem", color: "#333" }}>
        Ops! A página que você tentou acessar não existe.
      </p>
      <button
        onClick={handleGoDashboard}
        style={{
          marginTop: "20px",
          padding: "10px 25px",
          fontSize: "1rem",
          backgroundColor: "#c00000", // vermelho igual ao 404
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Voltar ao login
      </button>
    </div>
  );
}
