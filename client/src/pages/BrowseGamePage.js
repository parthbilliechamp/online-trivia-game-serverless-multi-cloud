import React, { useEffect, useState } from "react";
import "./BrowseGamePage.css";
import GameList from "../components/browse-games/GameList";
import LobbyPage from "./LobbyPage";

const BrowseGamePage = () => {
  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const [selectedGame, setSelectedGame] = useState(null);
  const [showLobby, setShowLobby] = useState(false);

  useEffect(() => {
    setLoading(true); // Start loading

    // Fetch game data from the endpoint with query parameters
    const endpoint = new URL(
      "https://4csw59l0ef.execute-api.us-east-1.amazonaws.com/dev/browsegame"
    );

    if (category !== "") {
      endpoint.searchParams.append("category", category);
    }

    if (difficultyLevel !== "") {
      endpoint.searchParams.append("difficultyLevel", difficultyLevel);
    }

    if (timeFrame !== "") {
      endpoint.searchParams.append("timeFrame", timeFrame);
    }

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
        setLoading(false); // Stop loading when data is received
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Stop loading on error
      });
  }, [category, difficultyLevel, timeFrame]);

  const handleJoinGame = (gameId) => {
    const selectedGame = games.find((game) => game.gameId === gameId);
    setSelectedGame(selectedGame);
    setShowLobby(true);
  };

  const handleBackToBrowse = () => {
    setShowLobby(false);
    setSelectedGame(null);
  };

  if (showLobby && selectedGame) {
    return (
      <LobbyPage game={selectedGame} onBackToBrowse={handleBackToBrowse} />
    );
  }

  return (
    <div>
      <h1>Browse Games</h1>
      <div className="filter-container">
        <label htmlFor="category-filter">Category:</label>
        <input
          type="text"
          id="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label htmlFor="difficulty-filter">Difficulty Level:</label>
        <input
          type="text"
          id="difficulty-filter"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
        />

        <label htmlFor="timeframe-filter">Time Frame:</label>
        <input
          type="text"
          id="timeframe-filter"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        />
      </div>

      {loading ? ( // Render the loader while loading is true
        <div className="loader">Loading...</div>
      ) : (
        <GameList games={games} joinGame={handleJoinGame} />
      )}
    </div>
  );
};

export default BrowseGamePage;
