import React, { useEffect, useState } from 'react';
import TeamStatistics from '../components/TeamStatistics';
import { AWS_API_GATEWAY_URL } from '../constants';
import { useLocation } from 'react-router-dom';

function TeamsStatisticsPage() {
  const [teamData, setTeamData] = useState(null);
  const location = useLocation();
  const team_name = location.state?.team_name || '';

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-team-stats?team_name=${team_name}`
        );
        const data = await response.json();
        setTeamData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, [team_name]);

  return teamData ? <TeamStatistics team_data={teamData} user_stats={{}} /> : "Loading";

}

export default TeamsStatisticsPage;