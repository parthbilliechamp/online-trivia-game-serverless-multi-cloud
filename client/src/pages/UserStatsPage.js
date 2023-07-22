import React, { useEffect, useState } from "react";
import UserStatistics from "../components/UserStatistics";
import { AWS_API_GATEWAY_URL } from "../constants";

const UserStatsPage = () => {
  const [user_stats, setUserStats] = useState(null);
  const [team_data, setTeamData] = useState(null);

  useEffect(() => {
    // Function to fetch user stats data
    const fetchUserStats = async () => {
      try {
        const team_name = "RedBull";
        const user_email = "pr514457@dal.ca";
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-user-stats?user_email=${user_email}&team_name=${team_name}`
        );
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    // Function to fetch team data
    const fetchTeamData = async () => {
      try {
        const team_name = "RedBull"; // Replace with the team's name
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-team-stats?team_name=${team_name}`
        );
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    // Call both API functions when the component mounts
    fetchUserStats();
    fetchTeamData();
  }, []);

  return (
    <div className="user-stats-container">
      <h1 className="user-stats-title">User Statistics Page</h1>
      {user_stats && team_data ? (
        <UserStatistics user_stats={user_stats} team_data={team_data} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserStatsPage;
