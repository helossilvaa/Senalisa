"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/app/login/page.module.css";

export default function Login() {
  const [loginParams, setLoginParams] = useState({ username: "", password: "" });
  const [retorno, setRetorno] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    const checkToken = async () => {

      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await fetch(`${API_URL}/auth/validate`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (res.ok) {
          const data = await res.json();

          setTimeout(() => {
            if (data.usuario.funcao === "usuario") {
              router.push("/usuario/dashboard");
            } else if (data.usuario.funcao === "tecnico") {
              router.push("/tecnico/dashboard");
            } else {
              router.push("/admin/dashboard");
            }
          }, 1000);
  
        if (!res.ok) {
          localStorage.removeItem("token");
          return;
        }
  
        const data = await res.json();
        const funcao = data?.usuario?.funcao;
  
        if (funcao === "usuario") {
          router.push("/usuario/dashboard");
        } else if (funcao === "tecnico") {
          router.push("/tecnico/dashboard");
        } else if (funcao === "admin") {
          router.push("/admin/dashboard");
        } else {
          console.warn("Função desconhecida:", funcao);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Erro ao validar token:", err);
        localStorage.removeItem("token");
      }
    };
  
    checkToken();
  }, [router]);
  
}
  const login = async (e) => {
    e.preventDefault();
    setRetorno(null);
    setLoading(true);


    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginParams),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setRetorno({
          status: "success",
          mensagem: "Login realizado com sucesso!",
        });

        setTimeout(() => {
          if (data.usuario.funcao === "usuario") {
            router.push("/usuario/dashboard");
          } else if (data.usuario.funcao === "tecnico") {
            router.push("/tecnico/dashboard");
          } else {
            router.push("/admin/dashboard");
          }
        }, 1000);
      } else {
        setRetorno({ status: "error", mensagem: data.error || "Credenciais inválidas" });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setRetorno({ status: "error", mensagem: "Erro na requisição" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-signin w-100 m-auto">
      <form onSubmit={login}>
        <h1 className="h3 mb-3 fw-normal">Entrar</h1>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Usuário"
            value={loginParams.username}
            onChange={(e) => setLoginParams({ ...loginParams, username: e.target.value })}
          />
          <label htmlFor="floatingInput">Usuário</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Senha"
            value={loginParams.password}
            onChange={(e) => setLoginParams({ ...loginParams, password: e.target.value })}
          />
          <label htmlFor="floatingPassword">Senha</label>
        </div>

        <button className="btn btn-primary w-100 py-2 mt-3" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

          {retorno && (
            <div
              className={`alert alert-${
                retorno.status === "success" ? "success" : "danger"
              }`}
            >
              {retorno.mensagem}
            </div>
          )}
        </form>
    </main>
  );
}
