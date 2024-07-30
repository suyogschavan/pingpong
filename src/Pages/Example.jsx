import React from "react";
import { io } from "socket.io-client";

const Example = () => {
  const socket = io("http://localhost:9000");
  const createConnection = () => {
    socket.emit("msg", { name: "Suyog", std: "9th" });
  };
  //   const socket = io("http://localhost:9000");
  return (
    <div>
      <h1>HI</h1>
      <button onClick={createConnection} type="button">
        Create Connection
      </button>
    </div>
  );
};

export default Example;
