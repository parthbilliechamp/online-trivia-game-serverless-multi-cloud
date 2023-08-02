import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/TopLeaderStats.css";
import Card from 'react-bootstrap/Card';

function TopLeaderStats() {
  const [userEmails, setUserEmails] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const navigate = useNavigate();

  const handleTeamClick = (teamName) => {
    navigate('/team-stats', { state: { team_name: teamName } });
  };

  const handleUserClick = (userEmail) => {
    navigate('/user-stats', { state: { user_email: userEmail } });
  };

  useEffect(() => {
    // Function to fetch the user emails from the API
    const fetchUserEmails = async () => {
      try {
        const response = await fetch(
          "https://s90mn5ladf.execute-api.us-east-1.amazonaws.com/topusers"
        );
        if (response.ok) {
          const data = await response.json();
          setUserEmails(data.user_emails);
        } else {
          throw new Error("Failed to fetch user emails");
        }
      } catch (error) {
        console.error("Error fetching user emails:", error);
      }
    };

    // Function to fetch the team names from the API
    const fetchTeamNames = async () => {
      try {
        const response = await fetch(
          "https://s90mn5ladf.execute-api.us-east-1.amazonaws.com/topteams"
        );
        if (response.ok) {
          const data = await response.json();
          setTeamNames(data.team_names);
        } else {
          throw new Error("Failed to fetch team names");
        }
      } catch (error) {
        console.error("Error fetching team names:", error);
      }
    };

    // Call the API functions
    fetchUserEmails();
    fetchTeamNames();
  }, []);

  return (
    <div className="container mt-4 justify-content-center" style={{ width: "50%" }}>
      <h1 className="text-center">Top Leader Stats</h1>
      <div>
        <h2 className="text-center">User Emails</h2>
        <div className="team-names-container">
          {userEmails.map((userEmail, index) => (
            <Card key={index} className="mb-4">
              <Card.Body>
                <Card.Title>{userEmail}</Card.Title>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => handleUserClick(userEmail)}
                >
                  View User Stats
                </button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-center">Team Names</h2>
        <div className="team-names-container">
          {teamNames.map((teamName, index) => (
            <Card key={index} className="mb-4">
              <Card.Body>
                <Card.Title>{teamName}</Card.Title>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => handleTeamClick(teamName)}
                >
                  View Team Stats
                </button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopLeaderStats;
