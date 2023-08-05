import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

const TeamDetailStats = ({ team_data, user_stats, team_members }) => {
  const navigate = useNavigate();

  console.log("here");
  console.log(team_members);
  console.log(team_data);

  if (!user_stats || !team_data || !team_members) {
    return <p>Loading user statistics...</p>;
  }

  const handleCompareStatsClick = (user) => {
    console.log(user_stats);
    navigate("/compare-stats", {
      state: { user_data: user_stats, second_user_email: user },
    });
  };

  return (
    <Container>
      <br></br>
      <br></br>
      <Row>
        <Col xs={12} md={6}>
          <Card style={{ height: "100%" }}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <div
              style={{ backgroundColor: "rgb(39, 83, 148)", color: "white" }}
              className="card-header"
            >
              <b>Team Details</b>
            </div>

            <Card.Body>
              <Card.Text>
                <div className="row">
                  <div className="col">
                    <h5 className="card-title">
                      <b>Team Name :</b>
                    </h5>
                  </div>
                  <div className="col">
                    <p className="card-text">{team_data.team_name}</p>
                  </div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <div
              style={{ backgroundColor: "rgb(39, 83, 148)", color: "white" }}
              className="card-header"
            >
              <b>Team Members</b>
            </div>

            <Card.Body>
              <Card.Text>
                {team_members.map((member, index) => (
                  <div>
                    <div className="row">
                      <br></br>
                      <br></br>
                      <div className="col">
                        <p>{member.name}</p>
                      </div>
                      <div className="col">
                        <Button
                          style={{ backgroundColor: "rgb(39, 83, 148)" }}
                          className="btn-sm "
                          onClick={() => handleCompareStatsClick(member.email)}
                        >
                          {" "}
                          Compare Stats
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeamDetailStats;
