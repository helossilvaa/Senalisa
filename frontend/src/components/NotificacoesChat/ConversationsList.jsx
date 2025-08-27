import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css"; // garante bootstrap carregado
import "./ConversationsList.css"; // só para o badge vermelho

export default function ConversationsList({ onSelectConversation }) {
  // Estado inicial das conversas
  const [conversations] = useState([
    {
      id: 1,
      name: "Julio Junior Cavaliere",
      lastMessage: "is simply dummy text of the printing and...",
      time: "1h",
      unread: 2,
    },
    {
      id: 2,
      name: "Maria Oliveira",
      lastMessage: "Oi, tudo bem?",
      time: "10m",
      unread: 0,
    },
    {
      id: 3,
      name: "Carlos Souza",
      lastMessage: "Me chama quando puder!",
      time: "5m",
      unread: 5,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const filteredConversations =
    activeTab === "unread"
      ? conversations.filter((c) => c.unread > 0)
      : conversations;

  return (
    <div className="conversations-list container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
        <h2 className="h5 m-0">Conversas</h2>
        <CloseIcon style={{ cursor: "pointer" }} />
      </div>

      {/* Tabs */}
      <div className="d-flex gap-3 py-2 border-bottom">
        <span
          className={`cursor-pointer ${
            activeTab === "all" ? "fw-bold border-bottom border-dark" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          Todas
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "unread" ? "fw-bold border-bottom border-dark" : ""
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Não lidas
        </span>
      </div>

      {/* Lista */}
      <div className="list-group list-group-flush">
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectConversation?.(conv)}
          >
            <div className="d-flex align-items-center">
              {/* Avatar + badge */}
              <div className="position-relative rounded-circle bg-secondary me-3"
                   style={{ width: "40px", height: "40px" }}>
                {conv.unread > 0 && (
                  <span className="unread-badge">{conv.unread}</span>
                )}
              </div>

              {/* Info */}
              <div>
                <h6 className="mb-0">{conv.name}</h6>
                <small className="text-muted">{conv.lastMessage}</small>
              </div>
            </div>

            {/* Time */}
            <small className="text-muted">{conv.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
