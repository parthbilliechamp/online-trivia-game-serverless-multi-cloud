import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GCP_API_GATEWAY_URL,
  APP_LOGIN_URL,
  GCP_API_GATEWAY_KEY,
} from "../constants";

export default function RegisterationComponent() {
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [a1, setA1] = useState(null);
  const [a2, setA2] = useState(null);
  const [a3, setA3] = useState(null);

  const location = useLocation();
  const { userData } = location.state;

  const QNA_URL = `${GCP_API_GATEWAY_URL}/v1/user-registration?key=${GCP_API_GATEWAY_KEY}`;

  const handleSignUp = (e) => {
    e.preventDefault();

    //Store User security QNA in GCP Firestore
    const qna = {
      q1: q1,
      a1: a1,
      q2: q2,
      a2: a2,
      q3: q3,
      a3: a3,
      email: userData.email,
    };

    fetch(QNA_URL, {
      method: "POST",
      body: JSON.stringify(qna),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 201) {
          alert("Signup Successfull!!!");
          window.location.replace(APP_LOGIN_URL);
        } else {
          console.log("Error: Unable to register");
        }
      })
      .catch((error) => {
        alert(e, `Error: ${error.message}`, "Error");
      });
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
                <h3 className="mb-5">Sign up</h3>

                <div className="form-outline mb-4">
                  <input
                    type="location"
                    id="q1"
                    className="form-control form-control-lg"
                    value={q1}
                    onChange={(event) => setQ1(event.target.value)}
                  />
                  <label className="form-label" htmlFor="q1">
                    Question 1
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="a1"
                    className="form-control form-control-lg"
                    value={a1}
                    onChange={(event) => setA1(event.target.value)}
                  />
                  <label className="form-label" htmlFor="a1">
                    Answer 1
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="location"
                    id="q2"
                    className="form-control form-control-lg"
                    value={q2}
                    onChange={(event) => setQ2(event.target.value)}
                  />
                  <label className="form-label" htmlFor="q2">
                    Question 2
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="a2"
                    className="form-control form-control-lg"
                    value={a2}
                    onChange={(event) => setA2(event.target.value)}
                  />
                  <label className="form-label" htmlFor="a2">
                    Answer 2
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="q3"
                    className="form-control form-control-lg"
                    value={q3}
                    onChange={(event) => setQ3(event.target.value)}
                  />
                  <label className="form-label" htmlFor="q3">
                    Question 3
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="a3"
                    className="form-control form-control-lg"
                    value={a3}
                    onChange={(event) => setA3(event.target.value)}
                  />
                  <label className="form-label" htmlFor="a3">
                    Answer 3
                  </label>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                  style={{ backgroundColor: "#4abdac" }}
                  onClick={(e) => handleSignUp(e)}
                >
                  Add Security Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
