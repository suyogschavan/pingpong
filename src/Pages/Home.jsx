import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = ({ startGame }) => {
  const [name, setName] = useState("");
  const history = useNavigate();

  const handlePlay = () => {
    if (name.trim()) {
      localStorage.setItem("playerName", name);
      history("/lobby");
    } else {
      toast.warning("Please enter your name to play the game");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">
        <h1 className="text-6xl font-bold mb-6">Ping Pong Game</h1>
        <div className="text-3xl pb-5">
          <input
            className="font-bold bg-transparent border  text-center"
            type="text"
            name="playerName"
            id="playerName"
            placeholder="Enter name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <button
          onClick={handlePlay}
          className="bg-white text-blue-500 py-3 px-8 text-xl rounded-md transition duration-300 hover:bg-gray-200"
        >
          Play Now
        </button>
        <div className="flex mt-8 space-x-6 ">
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
