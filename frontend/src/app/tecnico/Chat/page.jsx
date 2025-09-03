'use client';

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./chat.css";
import { SidebarProvider } from '@/components/Header/sidebarContext'

// Socket.IO connection
const socket = io("http://localhost:8080", { transports: ["websocket"] });

const ChatPageTecnico = ({ currentUser }) => {
  const [chats, setChats] = useState([]);
  const [chatSelecionado, setChatSelecionado] = useState(null);
  const [carregandoChats, setCarregandoChats] = useState(true);
  const [mensagens, setMensagens] = useState([]);

  const messageRef = useRef();
  const bottomRef = useRef();

  // ======== Listar chats ========
  const listarChats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Token não encontrado no localStorage");
      return;
    }

    setCarregandoChats(true);
    try {
      const response = await fetch("http://localhost:8080/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("❌ Erro ao listar chats, status:", response.status);
        throw new Error("Erro ao listar chats");
      }

      const data = await response.json();
      console.log("✅ Chats carregados:", data);
      setChats(data);
    } catch (error) {
      console.error("Erro de rede ao listar chats:", error);
    } finally {
      setCarregandoChats(false);
    }
  };

  useEffect(() => {
    listarChats();
  }, []);

  // ======== Buscar mensagens do chat selecionado ========
  useEffect(() => {
    const fetchMensagens = async () => {
      if (!chatSelecionado) {
        console.warn("⚠️ Nenhum chat selecionado ainda");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Token não encontrado ao buscar mensagens");
        return;
      }

      console.log("🔎 Buscando mensagens do chat ID:", chatSelecionado.id);

      try {
        const response = await fetch(
          `http://localhost:8080/mensagem/chat/${chatSelecionado.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          console.error("❌ Falha ao buscar mensagens, status:", response.status);
          throw new Error("Erro ao buscar mensagens");
        }

        const data = await response.json();
        console.log("✅ Mensagens carregadas:", data);
        setMensagens(data);

        socket.emit("join_room", { chatId: chatSelecionado.id, userId: currentUser.id });
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };

    fetchMensagens();
  }, [chatSelecionado]);

  // ======== Receber mensagens em tempo real ========
  useEffect(() => {
    if (!chatSelecionado?.id) return;

    const handleReceiveMessage = (data) => {
      console.log("📩 Mensagem recebida via socket:", data);
      if (data.chat_id === chatSelecionado.id) {
        setMensagens((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [chatSelecionado?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // ======== Enviar mensagem ========
  const handleSubmit = async () => {
    if (!messageRef.current || !chatSelecionado || !currentUser) return;
    const message = messageRef.current.value.trim();
    if (!message) return;

    const mensageData = {
      chat_id: chatSelecionado.id,
      remetente_id: currentUser.id,
      mensagem: message,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Token não encontrado ao enviar mensagem");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/mensagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mensageData),
      });

      if (!response.ok) {
        console.error("❌ Falha ao enviar mensagem, status:", response.status);
        throw new Error("Erro ao enviar mensagem");
      }

      socket.emit("message", mensageData);
      console.log("✅ Mensagem enviada:", mensageData);
      messageRef.current.value = "";
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  // ======== Mostrar nome do outro (usuário) ========
  const getNomeDoOutro = (chat) => {
    if (chat.tecnico_id === currentUser?.id) {
      return chat.usuario_nome || `Usuário ${chat.usuario_id}`;
    } else {
      return chat.tecnico_nome || `Técnico ${chat.tecnico_id}`;
    }
  };

  return (
    <SidebarProvider>
      <div className="pagina-chat-completa">
        <aside className="lista-de-chats">
          <h2>Conversas (Técnico)</h2>
          {carregandoChats ? (
            <p className="loading-lista">Carregando chats...</p>
          ) : (
            <ul>
              {chats.length === 0 ? (
                <p className="loading-lista">Nenhum chat encontrado.</p>
              ) : (
                chats.map((chat) => (
                  <li
                    key={chat.id}
                    onClick={() => setChatSelecionado(chat)}
                    className={chatSelecionado?.id === chat.id ? "chat-ativo" : ""}
                  >
                    {getNomeDoOutro(chat)}
                  </li>
                ))
              )}
            </ul>
          )}
        </aside>

        <main className="chat-principal">
          {chatSelecionado ? (
            <div className="chat-container">
              <div className="chat-body">
                {mensagens.map((msg, i) => {
                  const isCurrentUser = msg.remetente_id === currentUser?.id;
                  const remetenteNome = isCurrentUser ? "Você (Técnico)" : getNomeDoOutro(chatSelecionado);
                  return (
                    <div
                      key={i}
                      className={`message-container ${isCurrentUser ? "message-mine" : ""}`}
                    >
                      <div className="sender-name">{remetenteNome}</div>
                      <div className="message-text">{msg.mensagem}</div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="chat-footer d-flex align-items-center p-2 border-top">
                <input
                  ref={messageRef}
                  type="text"
                  className="form-control"
                  placeholder={`Mensagem para ${getNomeDoOutro(chatSelecionado)}...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary ms-2"
                  onClick={() => handleSubmit()}
                >
                  Enviar
                </button>
              </div>
            </div>
          ) : (
            <div className="nenhum-chat-selecionado">
              Selecione um chat na barra lateral para começar a conversar.
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ChatPageTecnico;
