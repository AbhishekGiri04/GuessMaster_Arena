import React, { useState, useEffect } from 'react';
import { useGame } from '../context/Game';
import { useAuth } from '../context/Auth';
import ChatBox from './ChatBox';

export default function GameRoom({ room }) {
  const { joinRoom, leaveRoom, startRound, makeGuess, roomState } = useGame();
  const { user } = useAuth();
  const [joined, setJoined] = useState(false);
  const [guess, setGuess] = useState('');
  const [logs, setLogs] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    // listen to events relevant to this room using socket if provided
    const socket = (window.socket = (window.socket || null));
    // we use GameContext events (already handled in GameProvider), so this component is simple
  }, []);

  const handleJoin = () => {
    const payload = { roomId: room.roomId, username: user ? user.name : `Guest${Math.floor(Math.random()*1000)}`, userId: user ? user.id : null };
    joinRoom(payload, (res) => {
      if (res.ok) {
        setJoined(true);
        setNotice('You have joined the room!');
      }
      else alert(res.error || 'Join failed');
    });
  };

  const handleStart = () => {
    startRound({ roomId: room.roomId, isSinglePlayer: false, rangeMin: room.rangeMin || 1, rangeMax: room.rangeMax || 100 }, (res) => {
      if (!res.ok) alert(res.error || 'Failed to start');
    });
  };

  const submitGuess = (e) => {
    e.preventDefault();
    makeGuess({ roomId: room.roomId, guess: Number(guess) }, (res) => {
      setLogs(prev => [...prev, { time: Date.now(), res }]);
      if (res.error) alert(res.error);
      setGuess('');
    });
  };

  return (
    <div className="card">
      <h4>{room.name}</h4>
      <div className="small">Players: {room.players ? room.players.length : 0} / {room.maxPlayers}</div>
      {notice && <div className="notice" style={{color:'green', marginBottom:8}}>{notice}</div>}
      {!joined ? <button className="button" onClick={handleJoin}>Join Room</button> : (
        <>
          <div style={{marginTop:8}}>
            <button className="button" onClick={handleStart}>Start Round</button>
          </div>
          <form onSubmit={submitGuess} style={{marginTop:10}}>
            <input className="input" value={guess} onChange={e=>setGuess(e.target.value)} placeholder="Enter your guess" />
            <div style={{marginTop:8}}><button className="button" type="submit">Guess</button></div>
          </form>
          <div style={{marginTop:10}}>
            <h5>Recent activity</h5>
            <div className="small">{logs.map((l, i) => <div key={i}>{JSON.stringify(l.res)}</div>)}</div>
          </div>
          <ChatBox roomId={room.roomId} />
        </>
      )}
    </div>
  );
}
