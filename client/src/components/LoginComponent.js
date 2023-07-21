import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginComponent() {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const callbackUrl = `https://us-central1-my-project-1513564562994.cloudfunctions.net/user-login-callback?code=${code}`;
    fetch(callbackUrl, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/sfa", {state: { userData: data }});
      })
      .catch((error) => {
        console.error('Error retrieving user email:', error);
      });
  }, []);

  return <></>;
}
