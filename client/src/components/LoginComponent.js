import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GCP_API_GATEWAY_URL, GCP_API_GATEWAY_KEY } from "../constants";

export default function LoginComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const callbackUrl = `${GCP_API_GATEWAY_URL}/v1/user-login-callback?code=${code}&key=${GCP_API_GATEWAY_KEY}`;
    fetch(callbackUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/sfa", { state: { userData: data } });
      })
      .catch((error) => {
        console.error("Error retrieving user email:", error);
      });
  }, []);

  return <></>;
}
