'use client';
import { useState, useEffect } from 'react';
import './chat.css';
import Join from '@/components/Join/Join';
import Conversas from '@/components/Coversas/Conversas';
import Header from '@/components/Header/header';
import NoticacaoesChat from '@/components/NotificacoesChat/ConversationsList';
import Loading from '@/components/loading/loading';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/Header/sidebarContext'
// import jwtDecode from 'jwt-decode';

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          alert('Seu login expirou.');
          router.push('/login');
          return;
        }
        setCurrentUser(decoded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  useEffect(() => {
    if (socket) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [socket]);

  const handleSelectConversation = (chat) => {
    setSelectedChat(chat);
  };

  const renderView = () => {
    if (!chatVisibility) {
      return <Join setSocket={setSocket} setChatVisibility={setChatVisibility} />;
    }

    return (
      <SidebarProvider>
      <div className="layout-geral">
        <Header />
        <div className="chat-wrapper">
          <div className="notificacoes-container">
            <NoticacaoesChat onSelectConversation={handleSelectConversation} />
          </div>
          <div className="chat-container">
            {selectedChat ? (
              <Conversas
                socket={socket}
                selectedChat={selectedChat}
                currentUser={currentUser}
              />
            ) : (
              <div className="text-center p-5">
                <h3>Selecione uma conversa para começar</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      </SidebarProvider>
    );
  };

  return <div className="caixa-fundo">{loading ? <Loading /> : renderView()}</div>;
}

export default App;
