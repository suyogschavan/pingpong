const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const games = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("createGame", (playerName) => {
    console.log("createGame event received", playerName);
    const gameId = uuidv4();
    games[gameId] = {
      players: [{ id: socket.id, name: playerName, ready: false }],
    };
    socket.join(gameId);
    console.log("Game created with ID:", gameId);
    socket.emit("gameCreated", { gameId });
  });

  socket.on("joinGame", ({ gameId, playerName }) => {
    console.log("joinGame event received", gameId, playerName);
    if (games[gameId] && games[gameId].players.length < 2) {
      games[gameId].players.push({
        id: socket.id,
        name: playerName,
        ready: false,
      });
      socket.join(gameId);
      console.log("Player joined game:", gameId, playerName);
      io.to(gameId).emit("playerJoined", games[gameId]);
    } else {
      socket.emit("error", { message: "Game not found or full" });
    }
  });

  socket.on("playerReady", ({ gameId }) => {
    console.log("playerReady event received", gameId);
    const game = games[gameId];
    if (game) {
      const player = game.players.find((p) => p.id === socket.id);
      if (player) {
        player.ready = true;
        console.log("Player ready:", socket.id);
        if (game.players.every((p) => p.ready)) {
          console.log("All players ready, starting game:", gameId);
          io.to(gameId).emit("startGame");
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    // Handle player disconnection
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
