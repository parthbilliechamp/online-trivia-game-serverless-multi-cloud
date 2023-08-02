import React, { useEffect, useState } from "react";
import UserStatistics from "../components/UserStatistics";
import { AWS_API_GATEWAY_URL } from "../constants";
import TeamStatistics from "../components/TeamStatistics";

const UserStatsPage = () => {
  const [user_stats, setUserStats] = useState(null);
  const [team_data, setTeamData] = useState(null);

  useEffect(() => {
    // Function to fetch user stats data
    const fetchUserStats = async () => {
      try {
        const user_email = "pr514457@dal.ca";
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-user-stats?user_email=${user_email}`
        );
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    const fetchTeamData = async () => {
      try {
        const team_name = "RedBull";
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-team-stats?team_name=${team_name}`
        );
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchUserStats();
    fetchTeamData();
  }, []);

  return (
    <div className="user-stats-container">
      <h1 className="user-stats-title">User Statistics Page</h1>
      {user_stats && team_data ? (
        <>
          <UserStatistics user_stats={user_stats} />
          <TeamStatistics team_data={team_data} user_stats={user_stats} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserStatsPage;
