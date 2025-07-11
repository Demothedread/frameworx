import React, { useEffect, useState } from 'react';

export default function Game() {
  const [highscore, setHighscore] = useState(null);

  useEffect(() => {
    fetch('/api/game/highscore')
      .then(res => res.json())
      .then(data => setHighscore(data.highscore));
  }, []);

  return (
    <section>
      <h2>Sample Game</h2>
      <p>Highscore: {highscore}</p>
      {/* Extension: Plug in a real game or leaderboard here */}
    </section>
  );
}
