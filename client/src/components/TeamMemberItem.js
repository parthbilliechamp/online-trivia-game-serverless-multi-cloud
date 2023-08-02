import React from "react";

const TeamMemberItem = ({ member }) => {
  return (
    <div>
      <p>{member.name}</p>
      <p>{member.email}</p>
      <p>{member.userId}</p>
      {/* Add more member details here if needed */}
    </div>
  );
};

export default TeamMemberItem;
