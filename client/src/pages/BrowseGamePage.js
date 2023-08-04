import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseGamePage.css";
import GameList from "../components/browse-games/GameList";

const BrowseGamePage = () => {
  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [teamInfo, setTeamInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        alert("An error occurred while fetching games.");
      });
  }, [category, difficultyLevel, timeFrame]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchTeamInfo(userId);
    }
  }, []);

  const fetchTeamInfo = (userId) => {
    fetch(
      "https://t8ulgpvf5e.execute-api.us-east-1.amazonaws.com/prod/team_info",
      {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTeamInfo(data);
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while fetching team information.");
      });
  };

  const handleTeamAction = (action, teamId, userId) => {
    // const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(
        "https://upth5gpm0d.execute-api.us-east-1.amazonaws.com/prod/manage_team_member",
        {
          method: "POST",
          body: JSON.stringify({ team_id: teamId, user_id: userId, action }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.reload();
          // You can handle the response here based on the action and show appropriate messages to the user.
        })
        .catch((error) => {
          console.error(error);
          alert("An error occurred while performing the team action.");
        });
    }
  };

  const handleJoinGame = (gameId) => {
    const selectedGame = games.find((game) => game.gameId === gameId);
    setSelectedGame(selectedGame);

    fetch(
      "https://9t6aq1p5n9.execute-api.us-east-1.amazonaws.com/prod/joingame",
      {
        method: "POST",
        body: JSON.stringify({
          gameId: gameId,
          userId: localStorage.getItem("userId"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log("Inside if");
          if (data.error === "User is not joined any team.") {
            console.log("Inside second if");
            const shouldCreateTeam = window.confirm(
              "You are not part of any team. Do you want to create a new team?"
            );
            if (shouldCreateTeam) {
              navigate("/CreateTeam");
            }
          } else if (
            data.error === "You have successfully joined the game!" ||
            data.error === "You are already a participant in this game."
          ) {
            const shouldProceed = window.confirm(
              "You have successfully joined the game. Do you want to proceed to the Lobby?"
            );
            if (shouldProceed) {
              navigate(`/lobby/${gameId}`);
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while joining the game.");
      });
  };

  const calculateTimeRemaining = (startTime) => {
    const currentTime = new Date().getTime();
    const startTimeFormatted = new Date(
      `${new Date().toDateString()} ${startTime}:00`
    );

    const difference = startTimeFormatted - currentTime;

    if (difference < 0) {
      return "Game has already started.";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        <u>Browse Games</u>
      </h2>
      <br></br>
      {teamInfo.length > 0 && (
        <div className="team-info">
          <h2>Your Team Information</h2>
          {teamInfo.map((team) => (
            <div key={team.teamName}>
              <h3>Team Name: {team.teamName}</h3>
              <ul>
                {team.teamMembers.map((member) => (
                  <li key={member.user_id}>
                    Member Name: {member.user_info.name} | Email:{" "}
                    {member.user_info.email}
                    {console.log(member.user_id)}
                    {console.log(team.admin)}
                    {localStorage.getItem("userId") === team.admin &&
                    member.user_id !== team.admin ? (
                      <button
                        onClick={() =>
                          handleTeamAction(
                            "remove_member",
                            team.teamId,
                            member.user_id
                          )
                        }
                      >
                        Remove Member
                      </button>
                    ) : null}
                    {localStorage.getItem("userId") === team.admin &&
                    member.user_id !== team.admin ? (
                      <button
                        onClick={() =>
                          handleTeamAction(
                            "promote_to_admin",
                            team.teamId,
                            member.user_id
                          )
                        }
                      >
                        Promote to Admin
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handleTeamAction(
                    "leave_team",
                    team.teamId,
                    localStorage.getItem("userId")
                  )
                }
              >
                Leave Team
              </button>
            </div>
          ))}
        </div>
      )}

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
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div>
          <GameList games={games} joinGame={handleJoinGame} />
          {selectedGame && (
            <div className="countdown-timer">
              Game starts in: {calculateTimeRemaining(selectedGame.start_time)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseGamePage;
