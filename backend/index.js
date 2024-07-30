const express = require("express");
const http = require("http");
const Server = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// socketIO
io.on("connect", (client) => {
  console.log("A new client is connected", client.id);

  client.on("msg", (msg) => {
    console.log("Client sent a message:  ", msg.name);
  });
});

server.listen(9000, () => console.log("server is on 9000"));
