import React from 'react';
import UserStatistics from '../components/user_profile_management/UserStatistics';

const UserStatsPage = () => {

  const user_stats = {
    'team_total_score': '90',
    'team_win_ratio': '0.7',
    'user_total_score': '2',
    'user_win_ratio': '0.5',
    'team_name': 'RedBull',
    'user_total_games_played': '3',
    'team_total_games_playe': '3',
    'user_games_won': '5',
    'team_games_won': '4'
}

const team_data = {
    'team_name' : 'RedBull',
    'team_members' : ['elvin@gmail.com', 'ddd@ddd.com']
}

  return (
    <div className="user-stats-container">
      <h1 className="user-stats-title">User Statistics Page</h1>
      <UserStatistics user_stats={user_stats} team_data ={team_data}/>
    </div>
  );
};

export default UserStatsPage;