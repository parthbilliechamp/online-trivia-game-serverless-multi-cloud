import React from 'react';

const UserStatistics = ({ user_stats, team_data }) => {
  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center mb-4">User Stats</h2>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Score</h5>
                <p className="card-text">{user_stats.user_total_score}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Games Played</h5>
                <p className="card-text">{user_stats.team_total_games_played}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Games Won</h5>
                <p className="card-text">{user_stats.user_games_won}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Win Ratio</h5>
                <p className="card-text">{user_stats.user_win_ratio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center mb-4">Team Stats</h2>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Team Name</h5>
                <p className="card-text">{team_data.team_name}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Games Played</h5>
                <p className="card-text">{user_stats.user_total_games_played}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Games Won</h5>
                <p className="card-text">{user_stats.team_games_won}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Win Ratio</h5>
                <p className="card-text">{user_stats.team_win_ratio}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="text-center mb-4">Team Details</h2>
            <h4 className="font-weight-bold">Team Name: {team_data.team_name}</h4>
            <h4 style={{ textAlign: "center" }}>Team Members</h4>
            <ul className="list-group">
              {team_data.team_members.map((user, index) => (
                <li className="list-group-item" key={index}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserStatistics;