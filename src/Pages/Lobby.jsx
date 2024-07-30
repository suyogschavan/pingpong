import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function Lobby() {
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const playerName = localStorage.getItem("playerName") || "Player1";

    socket.on("gameCreated", ({ gameId }) => {
      console.log("gameCreated event received", gameId);
      setGameId(gameId);
    });

    socket.on("playerJoined", (game) => {
      console.log("playerJoined event received", game);
      setPlayers(game.players);
    });

    socket.on("startGame", () => {
      console.log("startGame event received");
      navigate(`/game/${gameId}`);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("playerJoined");
      socket.off("startGame");
    };
  }, [navigate]);

  const handleCreateGame = () => {
    const playerName = localStorage.getItem("playerName") || "Player1";
    console.log("Emitting createGame with playerName:", playerName);
    socket.emit("createGame", playerName);
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    const playerName = localStorage.getItem("playerName");
    console.log(
      "Emitting joinGame with gameId:",
      gameId,
      "and playerName:",
      playerName
    );
    socket.emit("joinGame", { gameId, playerName });
  };

  const handleReady = () => {
    console.log("Emitting playerReady with gameId:", gameId);
    socket.emit("playerReady", { gameId });
  };

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      <form onSubmit={handleJoinGame}>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game ID"
        />
        <button type="submit">Join Game</button>
      </form>
      <p>Game ID: {gameId}</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} {player.ready ? "(Ready)" : ""}
          </li>
        ))}
      </ul>
      <button onClick={handleReady}>Ready</button>
    </div>
  );
}

export default Lobby;
