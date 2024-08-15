import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handlePlayRandom = () => {
    if (name.trim()) {
      const playerName = name;
      // Navigate to the lobby with a request to create a new game
      navigate("/lobby", {
        state: { playerName, newGame: true, playRandom: true },
      });
    } else {
      toast.warning("Please enter your name to play the game");
    }
  };

  const handleJoinRoom = () => {
    if (name.trim()) {
      const playerName = name;
      const gameId = prompt("Enter Game ID:");
      if (gameId) {
        navigate("/custom-lobby", {
          state: { playerName, gameId, newGame: false, playRandom: false },
        });
      } else {
        toast.warning("Please enter a valid Game ID");
      }
    } else {
      toast.warning("Please enter your name to join a game");
    }
  };

  const handleCreateRoom = () => {
    if (name.trim()) {
      const playerName = name;
      // Navigate to the lobby with a request to create a new game
      navigate("/custom-lobby", {
        state: { playerName, newGame: true, playRandom: false },
      });
    } else {
      toast.warning("Please enter your name to create a game");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">
        <h1 className="text-6xl font-bold mb-6">Ping Pong Game</h1>
        <div className="text-3xl pb-5">
          <input
            className="font-bold bg-transparent border text-center"
            type="text"
            name="playerName"
            id="playerName"
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          onClick={handlePlayRandom}
          className="bg-white text-blue-500 py-3 px-8 text-xl rounded-md transition duration-300 hover:bg-gray-200"
        >
          Play Random
        </button>
        <div className="pt-5 pb-5">
          <button
            onClick={handleJoinRoom}
            className="bg-white mr-5 text-blue-500 py-3 px-8 text-xl rounded-md transition duration-300 hover:bg-gray-200"
          >
            Join Room
          </button>
          <button
            onClick={handleCreateRoom}
            className="bg-white text-blue-500 py-3 px-8 text-xl rounded-md transition duration-300 hover:bg-gray-200"
          >
            Create Room
          </button>
        </div>

        <div className="flex mt-8 space-x-6">
          <a
            href="https://github.com/suyogschavan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl transition duration-300 hover:text-gray-200"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/suyogchavan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl transition duration-300 hover:text-gray-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
