import React, { useState } from 'react';
import { useGame } from '../context/Game';
import { useAuth } from '../context/Auth';

export default function ChatBox({ roomId }) {
  const [text, setText] = useState('');
  const { sendChat, messages } = useGame();
  const { user } = useAuth();

  const send = (e) => {
    e.preventDefault();
    if (!text) return;
    sendChat({ roomId, message: text, username: user ? user.name : 'Anon' });
    setText('');
  };

  return (
    <div className="card">
      <div className="chat">
        {messages.map((m, idx) => (
          <div key={idx}><strong>{m.username}</strong>: {m.message} <span className="small">({new Date(m.time).toLocaleTimeString()})</span></div>
        ))}
      </div>
      <form onSubmit={send} style={{marginTop:8}}>
        <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Say something..." />
        <div style={{marginTop:6}}>
          <button className="button" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}
