import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AWS_API_GATEWAY_URL } from '../constants';

function CompareUserStats() {
  const [userData, setUserData] = useState(null);
  const [secondUserData, setSecondUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const { user_data, second_user_email } = location.state;
    console.log('userData:', user_data);
    console.log('second_user_email:', second_user_email);

    const fetchUserStats = async () => {
      try {
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-user-stats?user_email=${second_user_email}`
        );
        const data = await response.json();
        setSecondUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setLoading(false);
      }
    };

    setUserData(user_data);
    fetchUserStats();
  }, [location.state]);

  const renderComparison = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!userData || !secondUserData) {
      return <div>Unable to fetch data for comparison</div>;
    }

    return (
      <div>
        <h2>Comparison of User Stats</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Stat</th>
              <th>{userData.user_email}</th>
              <th>{secondUserData.user_email}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Games Played</td>
              <td>{userData.user_total_games_played}</td>
              <td>{secondUserData.user_total_games_played}</td>
            </tr>
            <tr>
              <td>Total Score</td>
              <td>{userData.user_total_score}</td>
              <td>{secondUserData.user_total_score}</td>
            </tr>
            <tr>
              <td>Games Won</td>
              <td>{userData.user_games_won}</td>
              <td>{secondUserData.user_games_won}</td>
            </tr>
            <tr>
              <td>Win Ratio</td>
              <td>{userData.user_win_ratio}</td>
              <td>{secondUserData.user_win_ratio}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return <div>{renderComparison()}</div>;
}

export default CompareUserStats;
