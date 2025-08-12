// backend/websocket/votingServer.js
// Audience voting WebSocket server for LiveVideo channel

const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

let votingSession = null;

function startVotingSession(durationMs = 5 * 60 * 1000) {
  votingSession = {
    votes: { a: 0, b: 0 },
    start: Date.now(),
    end: Date.now() + durationMs,
    active: true,
    voters: new Set(),
    timer: setTimeout(() => endVotingSession(), durationMs)
  };
  io.emit('votingStarted', { end: votingSession.end });
}

function endVotingSession() {
  if (!votingSession || !votingSession.active) return;
  votingSession.active = false;
  clearTimeout(votingSession.timer);
  io.emit('votingEnded', {
    votes: votingSession.votes,
    winner: votingSession.votes.a > votingSession.votes.b ? 'A' : (votingSession.votes.b > votingSession.votes.a ? 'B' : 'Tie')
  });
}

io.on('connection', (socket) => {
  socket.on('joinVoting', () => {
    if (votingSession && votingSession.active) {
      socket.emit('votingStarted', { end: votingSession.end });
      socket.emit('voteUpdate', votingSession.votes);
    }
  });

  socket.on('castVote', ({ voterId, choice }) => {
    if (!votingSession || !votingSession.active) return;
    if (votingSession.voters.has(voterId)) return; // Prevent duplicate votes
    if (!['a', 'b'].includes(choice)) return;
    votingSession.voters.add(voterId);
    votingSession.votes[choice]++;
    io.emit('voteUpdate', votingSession.votes);
  });

  socket.on('startVoting', () => {
    if (!votingSession || !votingSession.active) startVotingSession();
  });
});

app.get('/status', (req, res) => {
  res.json({
    active: votingSession?.active || false,
    votes: votingSession?.votes || { a: 0, b: 0 },
    end: votingSession?.end || null
  });
});

server.listen(4001, () => {
  console.log('Voting WebSocket server running on port 4001');
});