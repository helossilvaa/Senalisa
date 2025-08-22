import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import style from './Conversas.module.css'

export default function Chat({ socket, userName }) {
  const bottomRef = useRef();
  const messageRef = useRef();
  const [messageList, setMessageList] = useState([]);
  const [author, setAuthor] = useState(userName || "");

  useEffect(() => {
    const handleUserInfo = (data) => {
      setAuthor(data.author);
    };
  
    const handleReceiveMessage = (data) => {
      setMessageList((current) => [...current, data]);
    };

    if (socket) {
      socket.on('user_info', handleUserInfo);
      socket.on('receive_message', handleReceiveMessage);
    }

    return () =>{ 
      if (socket) {
        socket.off('user_info', handleUserInfo);
        socket.off('receive_message', handleReceiveMessage);
      }
    }
  }, [socket]);

  useEffect(() => {
    scrollDown();
  }, [messageList]);

  const handleSubmit = () => {
    const message = messageRef.current.value;
    if (!message.trim() || !socket) return;

    socket.emit('message', message);
    clearInput();
    focusInput();
  };

  const clearInput = () => {
    messageRef.current.value = '';
  };

  const focusInput = () => {
    messageRef.current.focus();
  };

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const scrollDown = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={style['chat-container']}>
      {/* HEADER */}
      <div className={style['chat-header']}>
        <div className={style['chat-header-left']}>
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className={style['chat-avatar']}
          />
          <div>
            <h1>{author || "Usuário"}</h1>
            <span className={style['chat-status']}>Online</span>
          </div>
        </div>
      </div>
  
      {/* BODY */}
      <div className={style["chat-body"]}>
        {messageList.map((message, index) => (
          <div
            className={`${style["message-container"]} ${
              message.authorId === socket?.id && style["message-mine"]
            }`}
            key={index}
          >
            <div className={style["message-author"]}>
              <strong>{message.author}</strong>
            </div>
            <div className={style["message-text"]}>{message.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
  
      {/* FOOTER */}
      <div className={style["chat-footer"]}>
        <Input
          inputRef={messageRef}
          placeholder='Digite algo...'
          onKeyDown={(e) => getEnterKey(e)}
          fullWidth
        />
        <SendIcon
          sx={{ m: 1, cursor: 'pointer' }}
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
}  