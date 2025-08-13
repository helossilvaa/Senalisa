"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function DashboardUsuario({ params }) {

    const router = useRouter();
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const API_URL = "http://localhost:8080";

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            
            const decoded = jwtDecode(token);

            if (decoded.funcao !== "usuario") {
                router.push("/");
                return;
            }

            if (decoded.exp < Date.now() / 1000) {
                localStorage.removeItem("token");
                alert("Seu login expirou.");
                router.push("/login");
                return;
            }

            const id = decoded.id;

            fetch(`${API_URL}/usuarios/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setUsuario(data);
                    setCarregando(false);
                })
                .catch((err) => {
                    console.error("Erro ao buscar usuário: ", err);
                    setCarregando(false);
                });

        } catch (error) {
            console.error("Token inválido:", error);
            localStorage.removeItem("token");
            router.push("/login");
        }
    }, [router]);

    if (carregando) {
        return <div>.</div>;
    }

    if (!usuario) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push('/')
    }

    return (
        <div>
            <h1>Olá, {usuario.nome}</h1>
        </div>
    )
    
}
