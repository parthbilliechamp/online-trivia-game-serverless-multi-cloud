import React from "react";

const TeamInvitationButton = ({ onInvite, user }) => {
  return <button onClick={() => onInvite(user)}>Invite</button>;
};

export default TeamInvitationButton;
