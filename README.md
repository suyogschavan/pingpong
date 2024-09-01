# Ping Pong Game
![Ping Pong Game](https://github.com/user-attachments/assets/453c1420-2ff0-4c01-bc23-daf7dde961d6)
_A fun, interactive, and real-time ping pong game built with Node.js, Socket.IO, React, and Tailwind CSS._

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Game Controls](#game-controls)
- [How to Play](#how-to-play)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Welcome to the Ping Pong Game! This project is a modern take on the classic ping pong game, featuring real-time multiplayer gameplay using WebSockets. Built with a Node.js backend, Socket.IO for real-time communication, and a React frontend styled with Tailwind CSS, this game is designed to provide a seamless and engaging user experience.

## Features

- **Create Custom Lobbies**: Easily create a custom lobby and share the game ID with a friend to join.
- **Play with Random Opponents**: Don't have a friend online? No worries! Join a random lobby and play against other players.
- **Ready Check**: The game starts only when all players in the lobby have clicked 'Ready', ensuring everyone is set for a fair match.
- **No Login Required**: Jump straight into the game without the hassle of creating an account or logging in.
- **Real-Time Multiplayer**: Play against other players in real-time using WebSockets.
- **Responsive Design**: Built with React and Tailwind CSS to ensure smooth gameplay on any device.
- **Customizable Settings**: Easily adjust game settings such as paddle size and ball speed.
- **Smooth Animations and Sound Effects**: Enhance the gaming experience with responsive animations and sound effects.
- **Backend with Node.js and Socket.IO**: Robust and scalable backend for handling real-time game logic.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Socket.IO
- **WebSocket Communication**: Socket.IO for real-time player interactions

## Demo

Check out the gameplay screenshots and video below to see the Ping Pong Game in action!

### Screenshots
<img width="973" alt="Screenshot 2024-09-01 at 2 54 37 PM" src="https://github.com/user-attachments/assets/192f75ca-e70c-4e5c-a1b4-9010479cc9e9">
<img width="1710" alt="Screenshot 2024-09-01 at 2 58 35 PM" src="https://github.com/user-attachments/assets/e4601ed0-0fa2-4b15-9a69-cd4461942975">

### Video
#### Play Random
https://github.com/user-attachments/assets/5861f11b-6942-4ad8-a337-3f63859a1e15

#### Custom-lobby
https://github.com/user-attachments/assets/7590f0a3-63aa-4520-be01-fed77ef2943e


## Usage

Once you've installed all dependencies and started both the backend and frontend servers, the game will be ready to play on [http://localhost:3000](http://localhost:3000).

1. **Create or Join a Lobby**: Start by creating a custom lobby and sharing the game ID with a friend, or join a random lobby to find an opponent.
2. **Ready Up**: The game begins when all players in the lobby click 'Ready'.
3. **Play the Game**: Use the keyboard controls to move your paddle and try to score against your opponent.
4. **Adjust Settings**: Use the settings panel to customize your game experience, such as paddle size and ball speed.

## Game Controls

- **Player 1**:
  - Move Up: `W` key
  - Move Down: `S` key

- **Player 2** (if playing multiplayer):
  - Move Up: `Up Arrow` key
  - Move Down: `Down Arrow` key

## How to Play

1. **Choose your mode**: Create a custom lobby to play with friends or join a random lobby for quick matches.
2. **Start the game**: Once all players in the lobby click 'Ready', the game begins.
3. **Control your paddle**: Use the assigned keys to move your paddle up and down.
4. **Score points**: Get the ball past your opponent’s paddle to score points.
5. **Win the game**: The first player to reach the designated winning score (default is 10) wins the game.

## Contributing

Contributions are welcome! If you'd like to improve the game or fix a bug, feel free to fork the repository and submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


