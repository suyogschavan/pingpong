import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import { Button, Collapse, List } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Countdown from "../components/Countdown";

const socket = io("http://localhost:4000");

function Lobby() {
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showCountdown, setShowCountDown] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const playerName = location.state?.playerName;
  const isNewGame = location.state?.newGame;
  const isRandom = location.state?.playRandom;

  useEffect(() => {
    if (isNewGame) {
      if (isRandom) {
        console.log("Requesting to play random");
        socket.emit("playRandom", playerName);
      } else {
        console.log("Creating new game for", playerName);
        socket.emit("createGame", playerName);
      }
    } else {
      console.log("Joining game with ID", location.state.gameId);
      socket.emit("joinGame", { gameId: location.state.gameId, playerName });
    }

    const handleGameCreated = ({ gameId, players }) => {
      console.log("Game created or joined successfully with ID", gameId);
      setGameId(gameId);
      setPlayers(players);
      setLoading(false);
      if (players.length === 0) setShowCountDown(true);
    };

    const handlePlayerJoined = (game) => {
      console.log("Player joined event received", game);
      setPlayers(game.players);
      setLoading(false);
    };

    const allReady = (gameId) => {
      console.log("All players are ready");
      setStartTimer(true);
    };

    const handleAllnotready = (gameId) => {
      console.log("All players are not ready");
      setStartTimer(false);
    };

    const handlePlayerLeft = (players) => {
      console.log("PlayerLeft event received");
      setPlayers(players);
    };

    const handleError = (message) => {
      toast.error(message);
      setLoading(false);
    };

    socket.on("gameCreated", handleGameCreated);
    socket.on("playerJoined", handlePlayerJoined);
    socket.on("startGame", handleStartGame);
    socket.on("error", handleError);
    socket.on("allReady", allReady);
    socket.on("allNotReady", handleAllnotready);
    socket.on("playerLeft", handlePlayerLeft);

    return () => {
      socket.off("gameCreated", handleGameCreated);
      socket.off("playerJoined", handlePlayerJoined);
      socket.off("startGame", handleStartGame);
      socket.off("error", handleError);
      socket.off("allReady", allReady);
      socket.off("allNotReady", handleAllnotready);
      socket.off("playerLeft", handlePlayerLeft);
    };
  }, [navigate, location.state, playerName, isNewGame, isRandom]);

  useEffect(() => {
    const handlePlayerReady = (players) => {
      setPlayers(players);
    };

    socket.on("playerReady", handlePlayerReady);

    return () => {
      socket.off("playerReady", handlePlayerReady);
    };
  }, [players]);

  const handleReady = () => {
    setReady((prevReady) => !prevReady);
    socket.emit("playerReady", { gameId, playerName, ready: !ready });
  };

  const handleCountdownComplete = () => {
    setShowCountDown(false);
    socket.emit("startGame", gameId);
  };

  function handleStartGame() {
    console.log("Start game event received");
    navigate(`/game/${gameId}`);
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex flex-col items-center justify-center">
        {startTimer ? <Countdown onComplete={handleStartGame} /> : null}
        <div className="bg-white shadow-md rounded-lg p-7 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4">
            {players.length === 0 ? "Waiting for players" : "Players"}
          </h1>
          {/* <Countdown onComplete={handleStartGame} /> */}
          {players.length === 0 ? (
            <img
              id="loader"
              className="flex h-80"
              src="pingpong.gif"
              alt="anything"
            />
          ) : null}
          <div className="mb-4">
            <List className="mt-2" sx={{ mt: 1 }}>
              <TransitionGroup className="md-2">
                {players.map((player, index) => (
                  <Collapse
                    key={index}
                    className="text-gray-700 font-normal pb-2 flex justify-between items-center"
                  >
                    <div className="flex justify-between w-full">
                      <span>
                        {player.name === playerName
                          ? `${player.name} (you)`
                          : player.name}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-lg text-white ${
                          player.ready ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {player.ready ? "Ready" : "Not Ready"}
                      </span>
                    </div>
                  </Collapse>
                ))}
              </TransitionGroup>
            </List>
          </div>
          <h3>
            {startTimer ? "" : "Game will start once all players are ready"}
          </h3>
          {players.length > 0 && (
            <button
              onClick={handleReady}
              className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
                ready
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } transition duration-300`}
              disabled={loading}
            >
              {ready ? "Unready" : "Ready"}
            </button>
          )}
        </div>
        {/* {startTimer ? <Countdown onComplete={handleStartGame} /> : ""} */}
      </div>
    </>
  );
}

export default Lobby;
