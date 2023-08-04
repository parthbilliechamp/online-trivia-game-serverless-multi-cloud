import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


const UserStatistics = ({ user_stats }) => {


  if (!user_stats) {
    return <p>Loading user statistics...</p>;
  }

  return (  
     
      <Card >
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <div style={{backgroundColor:'rgb(39, 83, 148)',color:'white'}} className="card-header"><b>User Stats</b></div>

      <Card.Body>
        <Card.Text>
        <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Total Score :</b></h5>
        </div>
        <div className="col">
          <p className="card-text">{user_stats.user_total_score}</p>
        </div>
      </div>


      <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Games Played :</b></h5>
        </div>
        <div className="col">
          <p className="card-text"> {user_stats.user_total_games_played}</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Games Won :</b></h5>
        </div>
        <div className="col">
          <p className="card-text">{user_stats.user_games_won}</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Win Ratio :</b></h5>
        </div>
        <div className="col">
        <p className="card-text">{parseFloat(user_stats.user_win_ratio).toFixed(2)}%</p>
        </div>
      </div>
        </Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    
  );
};

export default UserStatistics;
