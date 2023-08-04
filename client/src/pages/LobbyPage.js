import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LobbyPage.css";
import Card from "react-bootstrap/Card";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import CountDownTimer from "../components/CountDownTimer";

const LobbyPage = ({ onBackToBrowse }) => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/quiz", { state: { game } });
  };

  useEffect(() => {
    setLoading(true);

    fetch(
      "https://lzag828uij.execute-api.us-east-1.amazonaws.com/prod/find_game",
      {
        method: "POST",
        body: JSON.stringify({ gameId: gameId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setGame(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        alert("An error occurred while fetching game details.");
      });
  }, [gameId]);

  useEffect(() => {
    if (game) {
      const startTimeFormatted = new Date(
        `${new Date().toDateString()} ${game.start_time}:00`
      );
      const currentTime = new Date().getTime();
      const difference = startTimeFormatted - currentTime;

      if (difference > 0) {
        const timer = setTimeout(() => {
          // Redirect to /quiz page when the timer reaches 00:00
          navigate("/quiz");
        }, difference);
        return () => clearTimeout(timer);
      }
    }
  }, [game, navigate]);

  return (
    <div>
      {/* <h1>Lobby Page</h1> */}
      <Container>
        <Row>
          <Col xs={12} md={6} className="mb-4">
            <Card>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <div
                style={{ backgroundColor: "rgb(39, 83, 148)", color: "white" }}
                className="card-header"
              >
                <b>Lobby Page</b>
              </div>

              <Card.Body>
                <Card.Text>
                  <div className="row">
                    <div className="col">
                      <h4 className="card-title">
                        <b>
                          <u>Game Details</u>
                        </b>
                      </h4>
                    </div>
                    <div className="col">
                      <p className="card-text"></p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <h5 className="card-title">
                        <b>Title : </b>
                      </h5>
                    </div>
                    <div className="col">
                      <p className="card-text"> {game?.description} </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <h5 className="card-title">
                        <b>Category : </b>
                      </h5>
                    </div>
                    <div className="col">
                      <p className="card-text">{game?.category}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <h5 className="card-title">
                        <b>Difficulty Level : </b>
                      </h5>
                    </div>
                    <div className="col">
                      <p className="card-text">{game?.difficulty}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <h5 className="card-title">
                        <b>Time Frame : </b>
                      </h5>
                    </div>
                    <div className="col">
                      <p className="card-text">{game?.timeframe}</p>
                    </div>
                  </div>
                </Card.Text>
                {/* <Button variant="primary">Go somewhere</Button> */}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            {/* <Button style={{float:'right',backgroundColor:'rgb(39, 83, 148)'}}className="back-button" onClick={onBackToBrowse}>
        Back to Browse
      </Button> */}
          </Col>
          <CountDownTimer startDate={game?.start_time}></CountDownTimer>
          <br></br>
          <br></br>
          <Col xs={12} md={12}>
            <Table striped bordered hover>
              <thead>
                <tr
                  style={{
                    backgroundColor: "rgb(39, 83, 148)",
                    color: "white",
                  }}
                >
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {game?.teams?.map((team) => (
                  <tr>
                    <td>{team.teamName}</td>
                    <td>
                      {team.users.map((user_id, index) => {
                        const user = game?.users?.find(
                          (user) => user.user_id === user_id
                        );
                        return (
                          <span>
                            {user?.user_info?.name}{" "}
                            {index !== team.users.length - 1 ? ", " : ""}{" "}
                          </span>
                          // <td key={user_id}>{user?.user_info?.name}</td>
                        );
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      <Button
        variant="primary"
        onClick={handleStartQuiz}
        disabled={!{game}} // Disable the button if game is null or undefined
      >
        Start Quiz
      </Button>
    </div>
  );
};

export default LobbyPage;
