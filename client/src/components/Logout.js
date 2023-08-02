import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { APP_LOGOUT_URL, AWS_API_GATEWAY_URL } from '../constants';

function Logout() {

  const location = useLocation();
  const { userData } = 'user';

  useEffect(() => {
    const updateUserSession = () => {
      const URL = `${AWS_API_GATEWAY_URL}/updateuserloginsession`;
      const data = {
        email: userData.email,
        status: 1,
      };
      fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Logged")
        })
        .catch((error) => console.log(error));
    };
    window.location.replace(APP_LOGOUT_URL);
  });

  return (
    <></>
  )
}

export default Logout