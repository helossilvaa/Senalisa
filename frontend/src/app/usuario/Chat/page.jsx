'use client'
import { useState } from 'react';
import './chat.css';
import Join from '@/components/Join/Join';
import Conversas from '@/components/Coversas/Conversas'
import Header from '@/components/Header/header'
import NoticacaoesChat from '@/components/NotificacoesChat/ConversationsList'


function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState(null);

  const renderView = () => {
    if (!chatVisibility) {
      return <Join setSocket={setSocket} setChatVisibility={setChatVisibility} />;
    }

    return (
      <div className="layout-geral">
        <Header />
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

  return <div className="caixa-fundo">{renderView()}</div>;
}

export default App;
