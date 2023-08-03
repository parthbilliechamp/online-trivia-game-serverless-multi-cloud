import React, { useState } from "react";
import CreateTeamButton from "../components/CreateTeamButton";
import TeamMemberList from "../components/TeamMemberList";
// import TeamInvitationButton from "../components/TeamInvitationButton";

const CreateTeamPage = () => {
  const [teamCreated, setTeamCreated] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [adminUserId, setAdminUserId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Replace this with your actual API endpoint URL for team creation
  const createTeamEndpoint =
    "https://n868ragk4k.execute-api.us-east-1.amazonaws.com/prod/create_team";

  // Function to create the team
  const handleCreateTeam = async () => {
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
      console.log(data);
      setTeamCreated(true);
      setTeamId(data.teamId);
      setTeamName(data.teamName);
      setAdminUserId(data.adminUserId);
      setAllUsers(data.allUsers);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div>
      {!teamCreated ? (
        <CreateTeamButton onClick={handleCreateTeam} />
      ) : (
        <div>
          <h1>Team Details</h1>
          <p>Team ID: {teamId}</p>
          <p>Team Name: {teamName}</p>
          <p>Admin User ID: {adminUserId}</p>
          <TeamMemberList
            members={allUsers}
            teamData={{
              teamId,
              teamName,
              adminUserId,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CreateTeamPage;
