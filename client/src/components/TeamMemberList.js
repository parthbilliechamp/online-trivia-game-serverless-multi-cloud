import React from "react";
import TeamMemberItem from "./TeamMemberItem";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table,Button } from 'react-bootstrap';
const TeamMemberList = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state && location.state.data;
  console.log('state',receivedData);


  const InviteMemer =
    "https://tnbolwcoaj.execute-api.us-east-1.amazonaws.com/prod/invite_user";

  const handleInvite = async (member) => {
    try {
      const response = await fetch(InviteMemer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: location.state.data.teamId,
          teamAdmin: location.state.data.adminUserId,
          invitedUser: member.email,
          invitedUserId: member.userId,
        }),
      });

      const data = await response.json();
      console.log(data);
      alert(data)
    } catch (e) {
      console.log(e);
    }
  };

  const handleJoinGame = () => {
    navigate("/browsegame");
  };

  return (
    <div>
       <div>
         <h2 style={{textAlign:'center'}}className="user-stats-title"><u>Invite Users</u></h2>
         <br></br>
         <Container>
      <Row>
        <Col>
        <Table striped bordered hover>
        <thead>
  <tr  style={{backgroundColor:'rgb(39, 83, 148)',color:'white'}}>
    <th>Name</th>
    <th>Email</th>
    <th>User Id</th>
    <th>Invite</th>
  </tr>
</thead>
<tbody>
  {
     location.state.data.allUsers.map(item=>(
      <tr>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.userId}</td>
        <td><Button   onClick={() => {
              handleInvite(item);
            }}style={{backgroundColor:'rgb(39, 83, 148)',color:'white'}}>Invite</Button></td>
      </tr>
     ))
  }
  {/* <tr>
    <td><b>Total Games Played</b></td>
    <td>{userData.user_total_games_played}</td>
    <td>{secondUserData.user_total_games_played}</td>
  </tr>
  <tr>
    <td><b>Total Score</b></td>
    <td>{userData.user_total_score}</td>
    <td>{secondUserData.user_total_score}</td>
  </tr>
  <tr>
    <td><b>Games Won</b></td>
    <td>{userData.user_games_won}</td>
    <td>{secondUserData.user_games_won}</td>
  </tr>
  <tr>
    <td><b>Win Ratio</b></td>
    <td>{userData.user_win_ratio}</td>
    <td>{secondUserData.user_win_ratio}</td>
  </tr> */}
</tbody>
    </Table>
        </Col>
      </Row>
    </Container>
      </div>
      
      {/* {location.state.data.allUsers.map((member) => (
        <>
          <TeamMemberItem key={member.userId} member={member} />
          <button
            onClick={() => {
              handleInvite(member);
            }}
          >
            Invite {member.name}
          </button>
        </>
      ))} */}


<Button
                        onClick={handleJoinGame}
                        style={{
                          backgroundColor: "rgb(39, 83, 148)",
                          color: "white",
                        }}
                      >
                        Join Games
                      </Button>

    </div>
  );
};

export default TeamMemberList;
