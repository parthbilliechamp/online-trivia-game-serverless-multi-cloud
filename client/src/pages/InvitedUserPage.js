import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InvitedUserPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch teamId and invitedUserId from the URL query parameters
    const getInvitedUserData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const teamId = params.get("team_id");
        const invitedUserId = params.get("invited_user_id");

        // Now, send the data to the backend endpoint
        const addInvitedUserEndpoint =
          "https://yo0326phef.execute-api.us-east-1.amazonaws.com/prod/add_invited_user";

        const response = await fetch(addInvitedUserEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId: teamId,
            invitedUserId: invitedUserId,
          }),
        });

        // Check the response status to determine if the user was added successfully
        if (response.ok && localStorage.getItem("userId")) {
          // Redirect the user to the BrowseGamePage after successful processing
          navigate("/browsegame");
        } else {
          navigate("/login");
          // Handle any error or display an error message to the user
          console.error("Error adding invited user");
        }
      } catch (error) {
        console.error("Error fetching invited user data:", error);
      }
    };

    getInvitedUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Processing Invitation...</h1>
    </div>
  );
};

export default InvitedUserPage;
