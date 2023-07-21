import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Test() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = {
      sub: "443",
      email_verified: "true",
      phone_number_verified: "false",
      phone_number: "+17822222222",
      email: "kevin@gmail.com",
      username: "44389448-40c1-7028-1127-73f4e5db0155",
    };
    navigate("/sfa", { state: { userData: userData } });
  }, []);

  return <div>test</div>;
}

export default Test;
