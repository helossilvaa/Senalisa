import React from 'react';
import './ConversationsList.css'
import CloseIcon from '@mui/icons-material/Close';

export default function ConversationsList() {
  return (
    <div className="conversations-list">
      <div className="header">
        <h2>Conversas</h2>
        <CloseIcon style={{ cursor: 'pointer' }} />
      </div>
      <div className="tabs">
        <span className="active">Todas</span>
        <span>Não lidas</span>
      </div>
      <div className="conversation-item">
        <div className="avatar"></div>
        <div className="info">
          <h3>Julio Junior Cavaliere</h3>
          <p>is simply dummy text of the printing and...</p>
        </div>
        <div className="time">1h</div>
      </div>
      <div className="conversation-item">
        <div className="avatar"></div>
        <div className="info">
          <h3>Julio Junior Cavaliere</h3>
          <p>is simply dummy text of the printing and...</p>
        </div>
        <div className="time">1h</div>
      </div>
      <div className="conversation-item">
        <div className="avatar"></div>
        <div className="info">
          <h3>Julio Junior Cavaliere</h3>
          <p>is simply dummy text of the printing and...</p>
        </div>
        <div className="time">1h</div>
      </div>
    </div>
  );
}