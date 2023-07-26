import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AWS_API_GATEWAY_URL,
  GCP_API_GATEWAY_URL,
  GCP_API_GATEWAY_KEY,
} from "../constants";

export default function SecondFactorAuthenticationComponent() {
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [userQuestionsList, setUserQuestionsList] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const { userData } = location.state;
  console.log(location.state);

  useEffect(() => {
    const getUserUrl = `${GCP_API_GATEWAY_URL}/v1/view_user_security_questions?email=${userData.email}&key=${GCP_API_GATEWAY_KEY}`;
    console.log(getUserUrl);
    fetch(getUserUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          navigate("/register", { state: { userData: userData } });
        } else {
          throw new Error("Error fetching user questions");
        }
      })
      .then((data) => {
        setUserQuestionsList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userData, navigate]);

  const handleAuthentication = (e) => {
    e.preventDefault();

    const data = {
      user_email: userData.email,
      user_answer1: answer1,
      user_answer2: answer2,
      user_answer3: answer3,
    };
    const URL = `${GCP_API_GATEWAY_URL}/v1/user-2f-authentication?key=${GCP_API_GATEWAY_KEY}&user_email=${userData.email}&user_answer1=${answer1}&user_answer2=${answer2}&user_answer3=${answer3}`;
    fetch(URL, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        updateUserSession();
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/dashboard", { state: { userData: userData } });
      })
      .catch((error) => console.log(error));
  };

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
      })
      .catch((error) => console.log(error));
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-2-strong"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <h3 className="mb-5">Second Factor Authentication</h3>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="a1"
                    className="form-control form-control-lg"
                    value={answer1}
                    onChange={(event) => setAnswer1(event.target.value)}
                  />
                  <label className="form-label" htmlFor="typeEmailX-2">
                    {userQuestionsList["Q1"]}
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="a1"
                    className="form-control form-control-lg"
                    value={answer2}
                    onChange={(event) => setAnswer2(event.target.value)}
                  />
                  <label className="form-label" htmlFor="typeEmailX-2">
                    {userQuestionsList["Q2"]}
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="a1"
                    className="form-control form-control-lg"
                    value={answer3}
                    onChange={(event) => setAnswer3(event.target.value)}
                  />
                  <label className="form-label" htmlFor="typeEmailX-2">
                    {userQuestionsList["Q3"]}
                  </label>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                  style={{ backgroundColor: "#4abdac" }}
                  onClick={(e) => handleAuthentication(e)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
