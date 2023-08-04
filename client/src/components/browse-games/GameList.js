import React from "react";
import "./GameList.css";
import { Container, Row, Col,Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import CountdownTimer from "../CountDownTimer";

const GameList = ({ games, joinGame }) => {


  const handleJoinClick = (gameId) => {
    joinGame(gameId); // Call the joinGame function with the gameId
  };

  return (
   
    <Container>
       <br></br>
            <Row>
            
              
      {games.map((game) => (
          <Col xs={12} md={6} className="mb-4">
      

<Card >
      <div style={{backgroundColor:'rgb(39, 83, 148)',color:'white'}} className="card-header"><b>{game.description}</b></div>

      <Card.Body>
        <Card.Text>
        <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Category :</b></h5>
        </div>
        <div className="col">
          <p className="card-text">{game.category}</p>
        </div>
      </div>


      <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Difficulty Level :</b></h5>
        </div>
        <div className="col">
          <p className="card-text"> {game.difficultyLevel}</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Time Frame :</b></h5>
        </div>
        <div className="col">
          <p className="card-text">{game.timeFrame}</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h5 className="card-title"><b>Status :</b></h5>
        </div>
        <div className="col">
          <p className="card-text">{game.status}</p>
        </div>
      </div>
        </Card.Text>
       <Row>
        <Col xs={12} md={3}>
        <Button
          style={{
            backgroundColor: "rgb(39, 83, 148)",
            color: "white",
          }}
            onClick={() => handleJoinClick(game.gameId)} // Call handleJoinClick with the gameId
          >
            Join Game
          </Button>
      
         
        </Col>
        <Col xs={12} md={9}>
    <CountdownTimer startDate={game.start_time}></CountdownTimer></Col>
       </Row>
      </Card.Body>
    </Card>
    
        </Col>
      ))}
    
            
              </Row>
    </Container>
  
  );
};

export default GameList;
