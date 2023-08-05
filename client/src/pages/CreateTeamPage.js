import React, { useState, useEffect } from "react";
import CreateTeamButton from "../components/CreateTeamButton";
import TeamMemberList from "../components/TeamMemberList";
import { Container, Row, Col, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const CreateTeamPage = () => {
  const [teamCreated, setTeamCreated] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [adminUserId, setAdminUserId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  // Replace this with your actual API endpoint URL for team creation
  const createTeamEndpoint =
    "https://n868ragk4k.execute-api.us-east-1.amazonaws.com/prod/create_team";

  // Function to create the team
  // const handleCreateTeam = async () => {
  //   try {
  //     console.log("Inside try");
  //     const userId = localStorage.getItem("userId");
  //     console.log(userId);
  //     console.log("Calling endpoint");
  //     const response = await fetch(createTeamEndpoint, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId }),
  //     });

  //     const data = await response.json();
  //     console.log('data......',data);
  //     setTeamCreated(true);
  //     setTeamId(data.teamId);
  //     setTeamName(data.teamName);
  //     setAdminUserId(data.adminUserId);
  //     setAllUsers(data.allUsers);
  //   } catch (error) {
  //     console.error("Error creating team:", error);
  //   }
  // };
  useEffect(() => {
    const createTeam = async () => {
      try {
        console.log("Inside try");
        const userId = localStorage.getItem("userId");
        console.log(userId);
        console.log("Calling endpoint");
        const response = await fetch(createTeamEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        console.log("data......", data);
        setTeamCreated(true);
        setTeamId(data.teamId);
        setTeamName(data.teamName);
        setAdminUserId(data.adminUserId);
        setAllUsers(data.allUsers);
      } catch (error) {
        console.error("Error creating team:", error);
      }
    };

    createTeam(); // Call the function when the component mounts
  }, []); // Empty dependency array means the effect runs once after initial render

  const handleClickOfInviteUser = () => {
    console.log("alluysers", allUsers);
    const data = { allUsers, teamId, teamName, adminUserId };
    console.log("dataaa", data);
    navigate("/InviteUser", { state: { data } });
    };

  return (
    <div>
      {!teamCreated ? (
        <CreateTeamButton />
      ) : (
        <div>
          <Container>
            <Row>
              <Col xs={12} md={8}>
                <Card>
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <div
                    style={{
                      backgroundColor: "rgb(39, 83, 148)",
                      color: "white",
                    }}
                    className="card-header"
                  >
                    <b>Team Details</b>
                  </div>

                  <Card.Body>
                    <Card.Text>
                      <div className="row">
                        <div className="col">
                          <h5 className="card-title">
                            <b>Team Id :</b>
                          </h5>
                        </div>
                        <div className="col">
                          <p className="card-text">{teamId}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col">
                          <h5 className="card-title">
                            <b>Team Name :</b>
                          </h5>
                        </div>
                        <div className="col">
                          <p className="card-text"> {teamName}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col">
                          <h5 className="card-title">
                            <b>Admin User Id :</b>
                          </h5>
                        </div>
                        <div className="col">
                          <p className="card-text">{adminUserId}</p>
                        </div>
                      </div>
                      <br></br>
                      <Button
                        onClick={handleClickOfInviteUser}
                        style={{
                          backgroundColor: "rgb(39, 83, 148)",
                          color: "white",
                        }}
                      >
                        Invite Users
                      </Button>

                      
                    </Card.Text>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

          {/* <TeamMemberList
            members={allUsers}
            teamData={{
              teamId,
              teamName,
              adminUserId,
            }}
          /> */}
        </div>
      )}
    </div>
  );
};

export default CreateTeamPage;
