import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./countdown.css"; // Import custom styles for animation

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count >= 0) {
      const timer = setInterval(() => setCount((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="countdown-container">
      <CSSTransition
        in={count > 0}
        timeout={1000}
        classNames="fade"
        unmountOnExit
      >
        <div className="countdown-number">{count > 0 ? count : "Let's go"}</div>
      </CSSTransition>
    </div>
  );
};

export default Countdown;
