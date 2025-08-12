// LiveVideo.js - Audience Voting System Integration

import React, { useEffect, useState, useRef } from 'react';
// You must install socket.io-client: npm install socket.io-client
import { io } from 'socket.io-client';

function getVoterId() {
  // Simple random voter ID for demo; replace with user auth/session in production
  return (
    localStorage.getItem('voterId') ||
    (() => {
      const id = 'voter-' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('voterId', id);
      return id;
    })()
  );
}

export default function LiveVideo() {
  const [votes, setVotes] = useState({ a: 0, b: 0 });
  const [timer, setTimer] = useState(0);
  const [votingActive, setVotingActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [voted, setVoted] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('ws://localhost:4001');
    const socket = socketRef.current;

    socket.emit('joinVoting');

    socket.on('votingStarted', ({ end }) => {
      setVotingActive(true);
      setWinner(null);
      setVoted(false);
      setTimer(Math.floor((end - Date.now()) / 1000));
    });

    socket.on('voteUpdate', (votes) => {
      setVotes(votes);
    });

    socket.on('votingEnded', ({ votes, winner }) => {
      setVotingActive(false);
      setWinner(winner);
      setVotes(votes);
    });

    // Timer countdown
    let interval = setInterval(() => {
      if (votingActive && timer > 0) setTimer((t) => t - 1);
    }, 1000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [votingActive, timer]);

  const handleVote = (choice) => {
    if (!votingActive || voted) return;
    socketRef.current.emit('castVote', { voterId: getVoterId(), choice });
    setVoted(true);
  };

  const handleStartVoting = () => {
    socketRef.current.emit('startVoting');
  };

  return (
    <section>
      <h2>Live Video Channel</h2>
      <div style={{border: '2px dashed #aaa', padding: 24, textAlign: 'center', marginBottom: 24}}>
        {/* Placeholder for livestream player */}
        <p style={{color:'#777', fontStyle:'italic'}}>
          Live video streaming goes here.<br />
          To integrate: embed a livestream player, WebRTC, or YouTube Live component.<br />
        </p>
      </div>
      <div style={{background:'#181842', borderRadius:12, padding:24, boxShadow:'0 0 16px #333b75'}}>
        <h3 style={{color:'#fff'}}>Audience Voting</h3>
        {votingActive ? (
          <>
            <div style={{fontSize:'1.2em', marginBottom:12}}>
              Time left: <span style={{color:'#ff0'}}>{timer}s</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', gap:32, marginBottom:16}}>
              <button
                style={{
                  padding:'12px 32px', fontSize:'1.1em', borderRadius:'2em',
                  background:'#333b75', color:'#fff', border:'none', boxShadow:'0 0 8px #333b75',
                  opacity: voted ? 0.5 : 1, cursor: voted ? 'not-allowed' : 'pointer'
                }}
                disabled={voted}
                onClick={() => handleVote('a')}
              >
                Vote for Contestant A
              </button>
              <button
                style={{
                  padding:'12px 32px', fontSize:'1.1em', borderRadius:'2em',
                  background:'#ff1493', color:'#fff', border:'none', boxShadow:'0 0 8px #ff1493',
                  opacity: voted ? 0.5 : 1, cursor: voted ? 'not-allowed' : 'pointer'
                }}
                disabled={voted}
                onClick={() => handleVote('b')}
              >
                Vote for Contestant B
              </button>
            </div>
            <div style={{fontSize:'1.1em', color:'#fff', marginBottom:8}}>
              <b>Votes:</b> A: <span style={{color:'#0ff'}}>{votes.a}</span> | B: <span style={{color:'#ff0'}}>{votes.b}</span>
            </div>
            {voted && <div style={{color:'#0ff', marginTop:8}}>Your vote has been counted!</div>}
          </>
        ) : (
          <>
            <button
              style={{
                padding:'10px 28px', fontSize:'1em', borderRadius:'2em',
                background:'#333b75', color:'#fff', border:'none', boxShadow:'0 0 8px #333b75'
              }}
              onClick={handleStartVoting}
            >
              Start Voting Session
            </button>
            {winner && (
              <div style={{fontSize:'1.2em', color:'#fff', marginTop:16}}>
                Voting ended. Winner: <span style={{color:'#ff0'}}>{winner}</span>
                <br />
                Final Votes: A: <span style={{color:'#0ff'}}>{votes.a}</span> | B: <span style={{color:'#ff0'}}>{votes.b}</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
