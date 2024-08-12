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

const games = {}; // Stores ongoing games
let waitingPlayer = null; // Track a player waiting for an opponent

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle random matchmaking
  socket.on("playRandom", (playerName) => {
    if (waitingPlayer && waitingPlayer.name != playerName) {
      // If there is a waiting player, create a game with them
      console.log("Pairing with waiting player:", waitingPlayer.name);
      const gameId = uuidv4();
      games[gameId] = {
        players: [
          { id: waitingPlayer.id, name: waitingPlayer.name, ready: false },
          { id: socket.id, name: playerName, ready: false },
        ],
      };

      // Join both players to the game room
      socket.join(gameId);
      io.to(waitingPlayer.id).socketsJoin(gameId);
      console.log(`Game created with ID: ${gameId}`);

      // Notify both players that the game has started
      io.to(gameId).emit("gameCreated", {
        gameId,
        players: games[gameId].players,
      });

      // Reset waiting player
      waitingPlayer = null;
    } else {
      // If no waiting player, make this player wait for an opponent
      waitingPlayer = { id: socket.id, name: playerName };
      console.log("Waiting for an opponent:", playerName);
    }
  });

  // Handle creating a game
  socket.on("createGame", (playerName) => {
    const gameId = uuidv4();
    games[gameId] = {
      players: [{ id: socket.id, name: playerName, ready: false }],
    };
    socket.join(gameId);
    console.log("Game created with ID:", gameId);
    socket.emit("gameCreated", { gameId });
  });

  // Handle joining an existing game
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

  // Handle player ready event
  socket.on("playerReady", ({ gameId, playerName }) => {
    const game = games[gameId];
    if (game) {
      const player = game.players.find((p) => p.id === socket.id);
      if (player) {
        player.ready = true;
        console.log(playerName + "''Player ready:", socket.id);
        if (game.players.every((p) => p.ready)) {
          console.log("All players ready, starting game:", gameId);
          io.to(gameId).emit("startGame", gameId);
        }
      }
    }
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Remove player from waiting queue if disconnected
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }

    // Find and remove the player from any game
    for (const gameId in games) {
      const game = games[gameId];
      const playerIndex = game.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1); // Remove player
        console.log("Player removed from game:", gameId);
        if (game.players.length === 0) {
          delete games[gameId]; // Remove game if empty
          console.log("Game deleted:", gameId);
        } else {
          io.to(gameId).emit("playerLeft", games[gameId]);
        }
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  return res.send("HI");
});

const port = process.env.PORT || 4000;
const host = "0.0.0.0"; // Bind to all network interfaces
server.listen(port, host, () => console.log(`Server running on port ${port}`));
