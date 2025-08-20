"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
 
export default function Login() {
<<<<<<< HEAD

=======
 
>>>>>>> bde17cf7ed85742ccb88dd8484e25549335d37e5
  const [loginParams, setLoginParams] = useState({ username: "", password: "" });
  const [retorno, setRetorno] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = "http://localhost:8080";
<<<<<<< HEAD


  useEffect(() => {

    const checkToken = async () => {

=======
 
 
  useEffect(() => {
 
    const checkToken = async () => {
 
>>>>>>> bde17cf7ed85742ccb88dd8484e25549335d37e5
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
<<<<<<< HEAD

          const usuario = await res.json()

          setTimeout(() => {

            if (data.usuario.funcao === "usuario") {
              router.push("/usuario/dashboard");

            } else if (data.usuario.funcao === "tecnico") {
              router.push("/tecnico/dashboard");

=======
 
          const usuario = await res.json()
 
          setTimeout(() => {
 
            if (data.usuario.funcao === "usuario") {
              router.push("/usuario/dashboard");
 
            } else if (data.usuario.funcao === "tecnico") {
              router.push("/tecnico/dashboard");
 
>>>>>>> bde17cf7ed85742ccb88dd8484e25549335d37e5
            } else {
              router.push("/admin/dashboard");
            }
          }, 1000);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Erro ao validar token:", err);
        localStorage.removeItem("token");
      }
    };
 
    checkToken();
  }, []);
 
  // Função de login
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRetorno(null);
 
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginParams),
      });
 
      const data = await res.json();
 
      if (res.ok) {
<<<<<<< HEAD

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setRetorno({ status: "success", mensagem: "Login realizado com sucesso!" });

        setTimeout(() => {

            if (data.usuario.funcao === "usuario") {
              router.push("/usuario/dashboard");

            } else if (data.usuario.funcao === "tecnico") {
              router.push("/tecnico/dashboard");

=======
 
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
 
        setRetorno({ status: "success", mensagem: "Login realizado com sucesso!" });
 
        setTimeout(() => {
 
            if (data.usuario.funcao === "usuario") {
              router.push("/usuario/dashboard");
 
            } else if (data.usuario.funcao === "tecnico") {
              router.push("/tecnico/dashboard");
 
>>>>>>> bde17cf7ed85742ccb88dd8484e25549335d37e5
            } else {
              router.push("/admin/dashboard");
            }
          }, 1000);
<<<<<<< HEAD

      } else {
        setRetorno({ status: "error", mensagem: "Credenciais inválidas" });
      }

=======
 
      } else {
        setRetorno({ status: "error", mensagem: "Credenciais inválidas" });
      }
 
>>>>>>> bde17cf7ed85742ccb88dd8484e25549335d37e5
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
          <div className={`alert mt-3 alert-${retorno.status === "success" ? "success" : "danger"}`}>
            {retorno.mensagem}
          </div>
        )}
      </form>
    </main>
  );
}