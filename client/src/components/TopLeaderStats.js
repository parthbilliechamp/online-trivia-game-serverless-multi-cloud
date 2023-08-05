import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/TopLeaderStats.css";
import { Table, Button } from "react-bootstrap";

function TopLeaderStats() {
  const [userEmails, setUserEmails] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const navigate = useNavigate();

  const handleTeamClick = (teamName) => {
    navigate("/team-stats", { state: { team_name: teamName } });
  };

  const handleUserClick = (userEmail) => {
    navigate("/user-stats", { state: { user_email: userEmail } });
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
    <div
      className="container mt-4 justify-content-center"
      style={{ width: "50%" }}
    >
      <h1 className="text-center">Top Leader Stats</h1>
      <div>
        <h2 className="text-center">User Emails</h2>
        <Table striped bordered hover>
          <thead>
            <tr style={{ backgroundColor: "rgb(39, 83, 148)", color: "white" }}>
              <th>User Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userEmails.map((userEmail, index) => (
              <tr key={index}>
                <td>{userEmail}</td>
                <td>
                  <Button
                    onClick={() => handleUserClick(userEmail)}
                    style={{
                      backgroundColor: "rgb(39, 83, 148)",
                      color: "white",
                    }}
                    block
                  >
                    View User Stats
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div>
        <h2 className="text-center">Team Names</h2>

        <Table striped bordered hover>
          <thead>
            <tr style={{ backgroundColor: "rgb(39, 83, 148)", color: "white" }}>
              <th>User Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teamNames.map((teamName, index) => (
              <tr key={index}>
                <td>{teamName}</td>
                <td>
                  <Button
                    onClick={() => handleTeamClick(teamName)}
                    style={{
                      backgroundColor: "rgb(39, 83, 148)",
                      color: "white",
                    }}
                    block
                  >
                    View Team Stats
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TopLeaderStats;
