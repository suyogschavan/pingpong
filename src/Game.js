import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const Game = () => {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [ball, setBall] = useState({ x: 400, y: 300, vx: 5, vy: 5 });

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('players', (players) => {
      setPlayers(players);
    });

    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      Object.values(players).forEach(player => {
        context.fillRect(10, player.paddleY, 10, 100);
      });

      // Draw ball
      context.beginPath();
      context.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
      context.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [players, ball]);

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (event) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const paddleY = event.clientY - rect.top - 50;
      socket.emit('paddleMove', paddleY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [socket]);

  return <canvas ref={canvasRef} width={800} height={600} className="border border-gray-500" />;
};

export default Game;
