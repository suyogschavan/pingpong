import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const socket = io("http://localhost:4000");

function Lobby() {
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const playerName = location.state.playerName || "Player"; // Default name if not passed
  const isNewGame = location.state.newGame;
  const isRandom = location.state.playRandom;

  useEffect(() => {
    if (isNewGame) {
      if (isRandom) {
        console.log("Requesting to play random");
        socket.emit("playRandom", playerName);
      } else if(!isRandom) {
        console.log("Creating new game for", playerName);
        socket.emit("createGame", playerName);
      }
    } else if (location.state.gameId) {
      console.log("Joining existing game", location.state.gameId);
      setGameId(location.state.gameId);
      socket.emit("joinGame", { gameId: location.state.gameId, playerName });
    }

    socket.on("gameCreated", ({ gameId, players }) => {
      console.log("Game created or joined successfully with ID", gameId);
      setGameId(gameId);
      setPlayers(players);
      setLoading(false);
    });

    socket.on("playerJoined", (game) => {
      console.log("Player joined event received", game);
      setPlayers(game.players);
      setLoading(false);
    });

    socket.on("startGame", (gameId) => {
      console.log("Start game event received");
      navigate(`/game/${gameId}`);
    });

    socket.on("error", (message) => {
      toast.error(message);
      setLoading(false);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("playerJoined");
      socket.off("startGame");
    };
  }, [navigate, location.state, playerName, isNewGame, isRandom]);

  const handleCreateGame = () => {
    console.log("Emitting createGame with playerName:", playerName);
    setLoading(true);
    socket.emit("createGame", playerName);
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    console.log(
      "Emitting joinGame with gameId:",
      gameId,
      "and playerName:",
      playerName
    );
    setLoading(true);
    socket.emit("joinGame", { gameId, playerName });
  };

  const handleReady = () => {
    console.log("Emitting playerReady with gameId:", gameId);
    socket.emit("playerReady", { gameId, playerName });
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h1>Lobby</h1>
        <button onClick={handleCreateGame} disabled={loading || gameId}>
          {loading ? "Creating Game..." : "Create Game"}
        </button>
        <form onSubmit={handleJoinGame} style={{ marginTop: "20px" }}>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Enter Game ID"
            disabled={loading}
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Joining Game..." : "Join Game"}
          </button>
        </form>
        {gameId && <p>Game ID: {gameId}</p>}
        <ul style={{ marginTop: "20px" }}> 
          {
          players.map((player) => (
            <li key={player.id}>
              {player.name} {player.ready ? "(Ready)" : ""}
            </li>
          ))}
        </ul>
        {players.length > 0 && (
          <button onClick={handleReady} disabled={loading}>
            Ready
          </button>
        )}
      </div>
    </>
  );
}

export default Lobby;
