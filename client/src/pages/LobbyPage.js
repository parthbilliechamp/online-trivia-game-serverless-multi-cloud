import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LobbyPage.css";

const LobbyPage = ({ onBackToBrowse }) => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetch(
      "https://lzag828uij.execute-api.us-east-1.amazonaws.com/prod/find_game",
      {
        method: "POST",
        body: JSON.stringify({ gameId: gameId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.teams);
        setGame(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        alert("An error occurred while fetching game details.");
      });
  }, [gameId]);

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (game) {
      const startTimeFormatted = new Date(
        `${new Date().toDateString()} ${game.start_time}:00`
      );
      const currentTime = new Date().getTime();
      const difference = startTimeFormatted - currentTime;

      if (difference > 0) {
        const timer = setTimeout(() => {
          // Redirect to /quiz page when the timer reaches 00:00
          navigate("/quiz");
        }, difference);
        return () => clearTimeout(timer);
      }
    }
  }, [game, navigate]);

  return (
    <div className="lobby-page">
      <h1>Lobby Page</h1>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div>
          <div className="game-details">
            <h2>Game Details</h2>
            <p>Title: {game?.description}</p>
            <p>Category: {game?.category}</p>
            <p>Difficulty Level: {game?.difficulty}</p>
            <p>Time Frame: {game?.timeframe}</p>
          </div>

          <div className="teams-list">
            <h2>Teams</h2>
            {game?.teams?.map((team) => (
              <div
                key={team.teamName}
                className="team-card"
                style={{ backgroundColor: generateRandomColor() }}
              >
                <p>Team Name: {team.teamName}</p>
                <ul>
                  {team.users.map((user_id) => {
                    const user = game?.users?.find(
                      (user) => user.user_id === user_id
                    );
                    return (
                      <li key={user_id}>Member: {user?.user_info?.name}</li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="back-button" onClick={onBackToBrowse}>
        Back to Browse
      </button>
    </div>
  );
};

export default LobbyPage;
