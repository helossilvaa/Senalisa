import React, { useRef, useState, useEffect } from "react";
import { Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import style from "./Conversas.module.css";

export default function Chat({ socket, selectedChat, currentUser }) {
  const bottomRef = useRef();
  const messageRef = useRef();
  const [messageList, setMessageList] = useState([]);

  // Buscar mensagens do banco
  useEffect(() => {
    const fetchMensagens = async () => {
      if (!selectedChat) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/mensagem/${selectedChat.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar mensagens");

        const data = await response.json();
        setMessageList(data);

        if (socket) socket.emit("join_room", selectedChat.id);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };

    fetchMensagens();
  }, [selectedChat, socket]);

  // Receber mensagem em tempo real
  useEffect(() => {
    if (!socket || !selectedChat?.id) return; // 🔹 garante que os dois existem
  
    const handleReceiveMessage = (data) => {
      if (data.Chat_id === selectedChat.id) {
        setMessageList((prev) => [...prev, data]);
      }
    };
  
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedChat?.id]); 

  // Scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  // Enviar mensagem
  const handleSubmit = async () => {
    if (!messageRef.current || !selectedChat || !currentUser) return;

    const message = messageRef.current.value;
    if (!message.trim()) return;

    const mensageData = {
      Chat_id: selectedChat.id,
      remetente_id: currentUser.id,
      mensagem: message,
    };

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:8080/mensagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mensageData),
      });

      socket.emit("message", mensageData); // 🔹 Confirme se no backend o evento é "message" ou "receive_message"

      messageRef.current.value = "";
    } catch (err) {
      console.error("Erro ao enviar mensagem", err);
    }
  };

  return (
    <div className={style["chat-container"]}>
      {/* BODY */}
      <div className={style["chat-body"]}>
        {messageList.map((msg, i) => (
          <div
            key={i}
            className={`${style["message-container"]} ${
              msg.remetente_id === currentUser?.id && style["message-mine"]
            }`}
          >
            <div className={style["message-text"]}>{msg.mensagem}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* FOOTER */}
      <div className={style["chat-footer"]}>
        <Input
          inputRef={messageRef}
          placeholder="Digite algo..."
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          fullWidth
        />
        <SendIcon sx={{ m: 1, cursor: "pointer" }} onClick={handleSubmit} />
      </div>
    </div>
  );
}
