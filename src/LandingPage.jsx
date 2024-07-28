import React from 'react';

const LandingPage = ({ startGame }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">
      <h1 className="text-6xl font-bold mb-6">Ping Pong Game</h1>
      <button
        onClick={startGame}
        className="bg-white text-blue-500 py-3 px-8 text-xl rounded-md transition duration-300 hover:bg-gray-200"
      >
        Play Now
      </button>
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
  );
};

export default LandingPage;
