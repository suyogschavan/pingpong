// Countdown.js
import React, { useEffect, useState } from "react";

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => setCount((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-white text-3xl font-bold">{count}</div>
      <style jsx>{`
        .text-white {
          font-size: 3rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Countdown;
