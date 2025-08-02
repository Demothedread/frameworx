import React, { useEffect, useState } from 'react';

/** Game channel with simple score submission and board display. */
export default function Game() {
  const [highscore, setHighscore] = useState(null);
  const [scores, setScores] = useState([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');

  // Fetch current scoreboard
  useEffect(() => {
    fetch('/api/game/scoreboard')
      .then(res => res.json())
      .then(data => setScores(data.scores || []));
    fetch('/api/game/highscore')
      .then(res => res.json())
      .then(data => setHighscore(data.highscore));
  }, []);

  const submit = e => {
    e.preventDefault();
    const numScore = parseInt(score, 10);
    if (!name || Number.isNaN(numScore)) return;
    fetch('/api/game/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score: numScore })
    }).then(() => {
      setName('');
      setScore('');
      fetch('/api/game/scoreboard')
        .then(r => r.json())
        .then(d => setScores(d.scores || []));
      fetch('/api/game/highscore')
        .then(r => r.json())
        .then(d => setHighscore(d.highscore));
    });
  };

  return (
    <section>
      <h2>Sample Game</h2>
      <p>Highscore: {highscore ?? '...'} </p>
      <form onSubmit={submit} style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Score"
          value={score}
          onChange={e => setScore(e.target.value)}
          type="number"
        />
        <button type="submit">Submit</button>
      </form>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {scores.map((s, i) => (
          <li key={i}>{s.name}: {s.score}</li>
        ))}
      </ul>
    </section>
  );
}
