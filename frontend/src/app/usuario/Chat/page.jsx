'use client';

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { SidebarProvider } from '@/components/Header/sidebarContext';
import "./chat.css";

// Conexão com Socket.IO
const socket = io("http://localhost:8080", { transports: ["websocket"] });

const ChatPage = ({ currentUser }) => {
  const [chats, setChats] = useState([]);
  const [chatSelecionado, setChatSelecionado] = useState(null);
  const [carregandoChats, setCarregandoChats] = useState(true);
  const [mensagens, setMensagens] = useState([]);

  const messageRef = useRef();
  const bottomRef = useRef();

  // ======== Listar chats ========
  const listarChats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("❌ Token não encontrado");

    setCarregandoChats(true);
    try {
      const res = await fetch("http://localhost:8080/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ao listar chats: ${res.status}`);
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error("Erro ao listar chats:", err);
    } finally {
      setCarregandoChats(false);
    }
  };

  useEffect(() => {
    listarChats();
  }, []);

  // ======== Buscar mensagens do chat selecionado ========
  useEffect(() => {
    if (!chatSelecionado) return;

    const fetchMensagens = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("❌ Token não encontrado");

      try {
        const res = await fetch(`http://localhost:8080/mensagem/chat/${chatSelecionado.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erro ao buscar mensagens: ${res.status}`);
        const data = await res.json();
        setMensagens(data);

        // Entrar na sala do chat
        socket.emit("join_room", { chatId: chatSelecionado.id, userId: currentUser.id });
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };

    fetchMensagens();
  }, [chatSelecionado]);

  // ======== Receber mensagens em tempo real ========
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (chatSelecionado && data.chat_id === chatSelecionado.id) {
        setMensagens((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [chatSelecionado]);

  // ======== Scroll automático ========
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // ======== Const separada para enviar mensagem ========
  const enviarMensagem = async (mensagem) => {
    if (!chatSelecionado || !currentUser) return;

    const token = localStorage.getItem("token");
    if (!token) return console.error("❌ Token não encontrado");

    try {
      const res = await fetch(`http://localhost:8080/mensagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatSelecionado.id,
          remetente_id: currentUser.id,
          mensagem,
        }),
      });

      if (!res.ok) throw new Error(`Erro ao enviar mensagem: ${res.status}`);

      const data = await res.json();

      // Atualiza localmente
      setMensagens((prev) => [...prev, data]);

      // Emite pelo socket
      socket.emit("message", data);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  // ======== Handle submit ========
  const handleSubmit = () => {
    if (!messageRef.current) return;

    const mensagem = messageRef.current.value.trim();
    if (!mensagem) return;

    enviarMensagem(mensagem);
    messageRef.current.value = "";
  };

  // ======== Função para pegar nome do outro usuário ========
  const getNomeDoOutro = (chat) => {
    if (chat.tecnico_id === currentUser?.id) return chat.usuario_nome || `Usuário ${chat.usuario_id}`;
    return chat.tecnico_nome || `Técnico ${chat.tecnico_id}`;
  };

  return (
    <SidebarProvider>
      <div className="pagina-chat-completa">
        <aside className="lista-de-chats">
          <h2>Conversas</h2>
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
                  const remetenteNome = isCurrentUser ? "Você" : getNomeDoOutro(chatSelecionado);
                  return (
                    <div key={i} className={`message-container ${isCurrentUser ? "message-mine" : ""}`}>
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
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button className="btn btn-primary ms-2" onClick={handleSubmit}>
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

export default ChatPage;
