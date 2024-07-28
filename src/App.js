import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Game from './Game';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
  };

  return (
    <div className="App">
      {isPlaying ? <Game /> : <LandingPage startGame={startGame} />}
    </div>
  );
}

export default App;
