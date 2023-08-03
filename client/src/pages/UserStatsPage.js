import React, { useEffect, useState } from "react";
import UserStatistics from "../components/UserStatistics";
import { AWS_API_GATEWAY_URL } from "../constants";
import TeamStatistics from "../components/TeamStatistics";
import { Container, Row, Col } from 'react-bootstrap';
import TeamDetailStats from "../components/TeamDetailStats";
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const UserStatsPage = () => {
  const [user_stats, setUserStats] = useState(null);
  const [team_data, setTeamData] = useState(null);
  const [teamName, setTeamName] = useState('');

  const userData = JSON.parse(localStorage.getItem("userData"));
  const breadcrumbStyle = {
    backgroundColor: 'transparent',
    padding: 0,
  };


  const fetchTeamNameFromUser = async () => {
    try {
      const userId = userData.username
      const url = `https://us-central1-trivia-392000.cloudfunctions.net/get-team-name?userId=${userId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data");
      console.log(data.teamName);
      setTeamName(data.teamName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const breadcrumbItemStyle = {
    display: 'inline-block',
    color:'black',
    marginRight: '5px', // Add margin between items
  };
  useEffect(() => {
    // Function to fetch user stats data
    const user_email = userData.email;
    const fetchUserStats = async () => {
      try {
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-user-stats?user_email=${user_email}`
        );
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    const fetchTeamData = async () => {
      try {
        await fetchTeamNameFromUser();
        console.log("team name");
        console.log(teamName);
        const response = await fetch(
          `${AWS_API_GATEWAY_URL}/get-team-stats?team_name=${teamName}`
        );
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchUserStats();
    fetchTeamData();
  }, [teamName]);

  return (
    <div className="user-stats-container">
      {/* <Breadcrumb style={breadcrumbStyle}>
      <Breadcrumb.Item style={breadcrumbItemStyle}>
        <span style={{color:'black'}}>Home</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item style={breadcrumbItemStyle} >
      <span style={{color:'black'}}>Library</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item style={breadcrumbItemStyle} active>
        Data
      </Breadcrumb.Item>
    </Breadcrumb> */}

      <h2 style={{textAlign:'center'}}className="user-stats-title"><u>User Statistics Page</u></h2>
      {user_stats && team_data ? (
        <div>
       <Container>
       <br></br>
    <Row>
      <Col xs={12} md={6}>
          <UserStatistics user_stats={user_stats} />
         
          </Col>
      <Col xs={12} md={6}>
    
      <TeamStatistics team_data={team_data} user_stats={user_stats} />
    
      </Col>
      
    </Row>
   
   
  </Container>
  <TeamDetailStats team_data={team_data} user_stats={user_stats}  />
  </div>
    

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserStatsPage;
