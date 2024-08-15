import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import SlCopyButton from "@shoelace-style/shoelace/dist/react/copy-button";
import Collapse from "@mui/material/Collapse";
import { List } from "@mui/material";

import { TransitionGroup } from "react-transition-group";

const socket = io("http://localhost:4000");

export const CustomLobby = () => {
  const CopyBtn = ({ text }) => {
    return (
      <SlCopyButton
        value={text}
        copy-label="Copy Game ID"
        success-label="Copied!"
      />
    );
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const [ready, setReady] = useState(false);

  const playerName = location.state.playerName;
  const isNewGame = location.state.newGame;

  useEffect(() => {
    if (isNewGame) {
      console.log("Creating new game for ", playerName);
      socket.emit("createGame", playerName);

      socket.on("gameCreated", ({ gameId, players }) => {
        console.log("Game created or joined successfully with ID", gameId);
        setGameId(gameId);
        setPlayers(players);
      });
    } else if (location.state.gameId) {
      console.log("Joining existing game", location.state.gameId);
      setGameId(location.state.gameId);
      socket.emit("joinGame", { gameId: location.state.gameId, playerName });
    }

    socket.on("playerJoined", (game) => {
      console.log("Player joined event received", game);
      setPlayers(game.players);
    });

    socket.on("playerLeft", (players) => {
      console.log("Player left event received");
      setPlayers(players);
    });

    socket.on("playerReady", (players) => {
      console.log("Player ready event received", players);
      setPlayers(players);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("playerReady");
      socket.off("startGame");
    };
  }, [navigate, location.state, playerName]);

  const handleReady = () => {
    setReady((prevReady) => !prevReady);
    socket.emit("playerReady", { gameId });
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-7 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4">Custom Lobby</h1>

          {gameId && (
            <div className="mb-4">
              <p className="text-lg font-semibold">
                {gameId}
                &nbsp;&nbsp;&nbsp;
                <CopyBtn text={gameId} className="" />
              </p>
            </div>
          )}

          <div className="mb-4">
            <h4 className="text-lg font-semibold">Players</h4>
            <List className="mt-2" sx={{ mt: 1 }}>
              <TransitionGroup className="md-2">
                {players.map((player, index) => (
                  <Collapse
                    key={index}
                    className="text-gray-700 font-normal pb-2 flex justify-between items-center"
                  >
                    <div className="flex justify-between w-full">
                      <span>{player.name}</span>
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

          <button
            onClick={handleReady}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
              ready
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } transition duration-300`}
          >
            {ready ? "Unready" : "Ready"}
          </button>
        </div>
      </div>
    </>
  );
};
