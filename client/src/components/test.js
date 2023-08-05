import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Test() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = {
      sub: "7478c468-a061-7014-b965-f389930bf5f4",
      email_verified: "true",
      phone_number_verified: "false",
      phone_number: "+17822222222",
      email: "pr514457@dal.ca",
      username: "7478c468-a061-7014-b965-f389930bf5f4",
    };
    navigate("/sfa", { state: { userData: userData } });
  }, []);

  return <div>test</div>;
}

export default Test;
