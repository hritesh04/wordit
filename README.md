# WordIt - Multiplayer Word Game

WordIt is an interactive, real-time multiplayer word game built with React, TypeScript, and Socket.io. Players join rooms and take turns creating words with given suffixes, challenging their vocabulary and quick thinking skills. Each player has a limited number of lives, and the game continues until only one player remains.

## Project Structure

This project uses a monorepo structure managed by Turborepo. The main components are:

- `apps/web`: The frontend React application
- `apps/server`: The backend Node.js server
- `packages/typescript-config`: Shared TypeScript configurations

## Features

- Real-time multiplayer gameplay
- Room creation and joining
- Turn-based word creation with suffixes
- Live player status updates
- Responsive design for various screen sizes
- Animated backgrounds

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Socket.IO Client
- Backend:
  - Node.js
  - Express
  - Socket.io
  - Typo.js for spell checking
- Shared:
  - Turborepo for monorepo management

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development servers:
   ```
   npm run dev
   ```

This will start both the frontend and backend servers concurrently.

## Game Rules

1. Players join a room
2. The game starts when more than half of the players are ready
3. Each turn, a player is given a suffix
4. The player must create a valid word ending with the given suffix
5. If the word is valid, play passes to the next player
6. If the word is invalid, the player loses a life and play passes to the next player
7. The game continues until only one player remains

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
