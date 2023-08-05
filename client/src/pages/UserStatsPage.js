import React, { useEffect, useState } from "react";
import UserStatistics from "../components/UserStatistics";
import { AWS_API_GATEWAY_URL } from "../constants";
import TeamStatistics from "../components/TeamStatistics";
import { Container, Row, Col } from "react-bootstrap";
import TeamDetailStats from "../components/TeamDetailStats";
import Breadcrumb from "react-bootstrap/Breadcrumb";

const UserStatsPage = () => {
  const [userStats, setUserStats] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const breadcrumbStyle = {
    backgroundColor: "transparent",
    padding: 0,
  };

  const breadcrumbItemStyle = {
    display: "inline-block",
    color: "black",
    marginRight: "5px", // Add margin between items
  };

  const fetchUserStats = async () => {
    try {
      const user_email = userData.email;
      const response = await fetch(
        `${AWS_API_GATEWAY_URL}/get-user-stats?user_email=${user_email}`
      );
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchTeamNameFromUser = async () => {
    try {
      const userId = userData.username;
      const url = `https://us-central1-trivia-392000.cloudfunctions.net/get-team-name?userId=${userId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTeamName(data.teamName);
      setTeamId(data.team_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response1 = await fetch(
        `https://us-central1-trivia-392000.cloudfunctions.net/get-user-ids-from-team-id?teamId=${teamId}`
      );
      const data1 = await response1.json();
      const { users } = data1;

      const userDetailsArray = [];

      // Iterate through the user IDs and call the second URL to get user details
      for (const userId of users) {
        const response2 = await fetch(
          `https://us-central1-trivia-392000.cloudfunctions.net/get-user-details-from-user-id?userId=${userId}`
        );
        const data2 = await response2.json();
        const { users: userDetails } = data2;

        // Add the user details to the userDetailsArray
        userDetailsArray.push(userDetails);
      }
      setTeamMembers(userDetailsArray);
      console.log(teamMembers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch userData first
    // Since this is asynchronous, make it a separate function
    const fetchUserData = async () => {
      // Fetch userData here (assuming it's asynchronous)
      // ...
      // Once the userData is fetched, proceed to fetch other data
      await fetchUserStats();
      await fetchTeamNameFromUser();
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch teamData and teamMembers only when teamName and teamId are available
    if (teamName && teamId) {
      const fetchTeamDataAndMembers = async () => {
        try {
          const response = await fetch(
            `${AWS_API_GATEWAY_URL}/get-team-stats?team_name=${teamName}`
          );
          const data = await response.json();
          setTeamData(data);
          console.log(data);
          fetchTeamMembers();
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      };

      fetchTeamDataAndMembers();
    }
  }, [teamName, teamId]);

  return (
    <div className="user-stats-container">
      {/* Breadcrumb Code */}
      {/* ... */}

      <h2 style={{ textAlign: "center" }} className="user-stats-title">
        <u>User Statistics Page</u>
      </h2>
      {userStats && teamData ? (
        <div>
          <Container>
            <br></br>
            <Row>
              <Col xs={12} md={6}>
                <UserStatistics user_stats={userStats} />
              </Col>
              <Col xs={12} md={6}>
                <TeamStatistics team_data={teamData} user_stats={userStats} />
              </Col>
            </Row>
          </Container>
          <TeamDetailStats team_data={teamData} user_stats={userStats} team_members={teamMembers}/>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserStatsPage;
