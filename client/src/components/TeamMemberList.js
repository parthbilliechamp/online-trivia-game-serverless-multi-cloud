import React from "react";
import TeamMemberItem from "./TeamMemberItem";

const TeamMemberList = ({ members, teamData }) => {
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
          teamId: teamData.teamId,
          teamAdmin: teamData.adminUserId,
          invitedUser: member.email,
          invitedUserId: member.userId,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <h2>Invite Users</h2>
      {members.map((member) => (
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
      ))}
    </div>
  );
};

export default TeamMemberList;
