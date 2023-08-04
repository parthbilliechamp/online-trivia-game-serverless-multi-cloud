import React from "react";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
function TeamStatistics({ team_data, user_stats }) {

  const navigate = useNavigate();

  if (!team_data || !user_stats) {
    return <p>Loading team detail statistics...</p>;
  }

  const handleCompareStatsClick = (user) => {
    console.log(user_stats);
    navigate("/compare-stats", { state: { user_data: user_stats, second_user_email: user } });
  };

  return (
  <div>
      <Card >
    {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
    <div style={{backgroundColor:'rgb(39, 83, 148)',color:'white'}} className="card-header"><b>Team Stats</b></div>

    <Card.Body>
      <Card.Text>
      <div className="row">
      <div className="col">
        <h5 className="card-title"><b>Team Name :</b></h5>
      </div>
      <div className="col">
        <p className="card-text">{team_data.team_name}</p>
      </div>
    </div>


    <div className="row">
      <div className="col">
        <h5 className="card-title"><b>Games Played :</b></h5>
      </div>
      <div className="col">
        <p className="card-text"> {team_data.team_total_games_played}</p>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <h5 className="card-title"><b>Games Won :</b></h5>
      </div>
      <div className="col">
        <p className="card-text">{team_data.team_games_won}</p>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <h5 className="card-title"><b>Win Ratio :</b></h5>
      </div>
      <div className="col">
        <p className="card-text">{team_data.team_win_ratio}</p>
      </div>
    </div>
      </Card.Text>
      {/* <Button variant="primary">Go somewhere</Button> */}
    </Card.Body>
  </Card>

  
  </div>
    
  );
}

export default TeamStatistics;
