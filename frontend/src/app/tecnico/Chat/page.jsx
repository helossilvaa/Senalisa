'use client'
import { useState, useEffect } from 'react';
import './chat.css';
import Join from '@/components/Join/Join';
import Conversas from '@/components/Coversas/Conversas';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import NoticacaoesChat from '@/components/NotificacoesChat/ConversationsList';
import loading from '@/components/loading/loading'

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false); 


  useEffect(() => {
    if (socket) {
      setLoading(true);
   
      setTimeout(() => setLoading(false), 1500); 
    }
  }, [socket]);

  const renderView = () => {
    if (!chatVisibility) {
      return <Join setSocket={setSocket} setChatVisibility={setChatVisibility} />;
    }

    return (
      <div className="layout-geral">
        <HeaderTecnico />
        <div className="chat-wrapper">
          <div className="notificacoes-container">
            <NoticacaoesChat />
          </div>
          <div className="chat-container">
            <Conversas socket={socket} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="caixa-fundo">
      {loading ? <loading /> : renderView()}
    </div>
  );
}

export default App;
