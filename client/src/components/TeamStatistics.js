import React from "react";
import { useNavigate } from "react-router-dom";

function TeamStatistics({ team_data, user_stats }) {
  const team_members = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com",
  ];
  console.log(team_data);
  console.log(user_stats);

  const navigate = useNavigate();

  const handleCompareStatsClick = (user) => {
    console.log(user_stats);
    navigate("/compare-stats", { state: { user_data: user_stats, second_user_email: user } });
  };

  return (
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
              <p className="card-text">{team_data.team_total_games_played}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Games Won</h5>
              <p className="card-text">{team_data.team_games_won}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Win Ratio</h5>
              <p className="card-text">{team_data.team_win_ratio}</p>
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
            {team_members.map((user, index) => (
              <li className="list-group-item" key={index}>
                {user}
                <button
                  className="btn btn-primary btn-sm float-right"
                  onClick={() => handleCompareStatsClick(user)}
                >
                  Compare Stats
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TeamStatistics;
