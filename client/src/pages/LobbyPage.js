import React from "react";
import "./LobbyPage.css";

const LobbyPage = ({ game, onBackToBrowse }) => {
  const teams = game.teams;

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="lobby-page">
      <h1>Lobby Page</h1>

      <div className="game-details">
        <h2>Game Details</h2>
        <p>Title: {game.description}</p>
        <p>Category: {game.category}</p>
        <p>Difficulty Level: {game.difficultyLevel}</p>
        <p>Time Frame: {game.timeFrame}</p>
      </div>

      <div className="teams-list">
        <h2>Teams</h2>
        {teams.map((team) => (
          <div
            key={team.teamId}
            className="team-card"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <p>Team Name: {team.teamName}</p>
            <ul>
              {team.teamMembers.map((member) => (
                <li key={member.userId}>Member: {member.userName}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={onBackToBrowse}>
        Back to Browse
      </button>
    </div>
  );
};

export default LobbyPage;
