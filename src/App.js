import React, { useState } from "react";
import LandingPage from "./Pages/Home";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";
import Join from "./Pages/Join";
import Create from "./Pages/Create";
// import Example from "./Pages/Example";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
  };

  return (
    // <div className="App">
    //   {isPlaying ? <Game /> : <LandingPage startGame={startGame} />}
    // </div>
    <Router>
      <Routes>
        <Route path="/" exact Component={Home} />
        {/* <Route path="/" exact Component={Example} /> */}
        <Route path="/lobby" Component={Lobby} />
        <Route path="/join" Component={Join} />
        <Route path="/create" Component={Create} />
        <Route path="/game/:gameId" Component={Game} />
      </Routes>
    </Router>
  );
}

export default App;
