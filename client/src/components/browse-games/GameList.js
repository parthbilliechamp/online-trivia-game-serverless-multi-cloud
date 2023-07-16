import React from "react";
import "./GameList.css";

const GameList = ({ games, joinGame }) => {
  const handleJoinClick = (gameId) => {
    joinGame(gameId); // Call the joinGame function with the gameId
  };

  return (
    <div className="game-list-container">
      {games.map((game) => (
        <div key={game.gameId} className="game-item">
          <h3>{game.description}</h3>
          <p>Category: {game.category}</p>
          <p>Difficulty Level: {game.difficultyLevel}</p>
          <p>Time Frame: {game.timeFrame}</p>
          <p>Status: {game.status}</p>
          <button
            className="join-button"
            onClick={() => handleJoinClick(game.gameId)} // Call handleJoinClick with the gameId
          >
            Join Game
          </button>
        </div>
      ))}
    </div>
  );
};

export default GameList;
