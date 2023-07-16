import React from "react";

const TeamList = ({ teams }) => {
  return (
    <div>
      {teams.map((team) => (
        <div key={team.teamId}>
          <h5>Team: {team.teamName}</h5>
          <p>Team Members:</p>
          <ul>
            {team.teamMembers.map((member) => (
              <li key={member.userId}>{member.userName}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamList;
