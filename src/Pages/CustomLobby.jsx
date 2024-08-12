import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Socket, io } from "socket.io-client";
import CopyToClipboard from "react-copy-to-clipboard";

const socket = io("http://localhost:4000");

export const CustomLobby = () => {
  const CopyBtn = ({ text }) => {
    return (
      <CopyToClipboard text={text} onCopy={() => alert("Copied!")}>
        <button>Copy</button>
      </CopyToClipboard>
    );
  };
  const location = useLocation();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);

  const playerName = location.state.playerName;

  useEffect(() => {
    console.log("Creating new game for ", playerName);
    socket.emit("createGame", playerName);

    socket.on("gameCreated", ({ gameId, players }) => {
      console.log("Game created or joined successfully with ID", gameId);
      setGameId(gameId);
      setPlayers(players);
    });

    socket.on("playerJoined", (game) => {
      console.log("Player joined event received", game);
      setPlayers(game.players);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("playerJoined");
      socket.off("startGame");
    };
  }, [navigate, location.state, playerName]);
  return (
    <>
      <ToastContainer />

      <div>{gameId && <p> Game ID: {gameId}</p>}</div>
      {gameId && <CopyBtn text={gameId}> </CopyBtn>}
    </>
  );
};
