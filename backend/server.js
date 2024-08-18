const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const games = {};
let waitingPlayer = null;

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("playRandom", (playerName) => {
    if (waitingPlayer && waitingPlayer.name != playerName) {
      console.log("Pairing with waiting player:", waitingPlayer.name);
      const gameId = uuidv4();
      games[gameId] = {
        players: [
          { id: waitingPlayer.id, name: waitingPlayer.name, ready: false },
          { id: socket.id, name: playerName, ready: false },
        ],
      };

      socket.join(gameId);
      io.to(waitingPlayer.id).socketsJoin(gameId);
      console.log(`Game created with ID: ${gameId}`);

      io.to(gameId).emit("gameCreated", {
        gameId,
        players: games[gameId].players,
      });

      waitingPlayer = null;
      console.log("Waiting player array is null");

    } else {
      if (!waitingPlayer || waitingPlayer.id !== socket.id) {
        waitingPlayer = { id: socket.id, name: playerName };
        console.log("Waiting for an opponent:", playerName);
      } else {
        console.log("Player already waiting:", playerName);
      }
    }
  });

  socket.on("createGame", (playerName) => {
    const gameId = uuidv4();
    games[gameId] = {
      players: [{ id: socket.id, name: playerName, ready: false }],
    };
    socket.join(gameId);
    console.log("Game created with ID:", gameId);
    socket.emit("gameCreated", { gameId, players: games[gameId].players });
  });

  socket.on("joinGame", ({ gameId, playerName }) => {
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
      socket.emit("error", "Game not found or full");
    }
  });

socket.on("playerReady", ({ gameId }) => {
  const game = games[gameId];
  if (game) {
    const player = game.players.find((p) => p.id === socket.id);
    if (player) {
      player.ready = !player.ready; // Toggle the ready state
      console.log(`${player.name} is ${player.ready ? "ready" : "not ready"}`);
      io.to(gameId).emit("playerReady", game.players);
      if (game.players.every((p) => p.ready)) {
        console.log("All players ready, starting game:", gameId);
        io.to(gameId).emit("allReady", gameId);
        // io.to(gameId).emit("startGame", gameId);
      }else{
        io.to(gameId).emit("allNotReady", gameId);
      }
    }
  }
});

socket.on("startGame", ({gameId})=>{
  io.to(gameId).emit("startGame", gameId);
})

  

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }

    for (const gameId in games) {
      const game = games[gameId];
      const playerIndex = game.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1); // Remove player
        console.log("Player removed from game:", gameId);
        if (game.players.length === 0) {
          delete games[gameId]; // Remove game if empty
          console.log("Game deleted:", gameId);
          io.to(gameId).emit("gameDeleted", gameId);
        } else {
          console.log("Player left ", game.players);
          
          io.to(gameId).emit("playerLeft", game.players); // Notify remaining players
        }
        break;
      }
    }
  });
});

const port = 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
