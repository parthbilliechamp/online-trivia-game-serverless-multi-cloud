import React from "react";
import { useState } from "react";
import userPool from "./aws-cognito/UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

export default function RegisterationComponent() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [a1, setA1] = useState(null);
  const [a2, setA2] = useState(null);
  const [a3, setA3] = useState(null);
  const [isCognitoSignUpSuccessful, setIsCognitoSignUpSuccessful] =
    useState(false);
  const [isFireStoreSignUpSuccessful, setIsFireStoreCognitoSignUpSuccessful] =
    useState(false);
  const QNA_URL =
    "https://us-central1-my-project-1513564562994.cloudfunctions.net/user_registration";

  const handleSignUp = (e) => {
    e.preventDefault();
    //Save User Signup in AWS Cognito

    const userAttributes = [
      { Name: "phone_number", Value: phoneNumber },
      { Name: "name", Value: name },
    ];

    const emailData = {
      Name: "email",
      Value: email,
    };

    const attributeList = userAttributes.map(
      (attr) => new CognitoUserAttribute(attr)
    );
    attributeList.push(new CognitoUserAttribute(emailData));

    userPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        setIsCognitoSignUpSuccessful(true);
      }
    });

    //Store User security QNA in GCP Firestore
    const qna = {
        q1: q1,
        a1: a1,
        q2: q2,
        a2: a2,
        q3: q3,
        a3: a3,
        email: email
    }

      fetch(QNA_URL, {
        method: "POST",
        body: JSON.stringify(qna),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 201) {
            setIsFireStoreCognitoSignUpSuccessful(true);
          } else {
            console.log("Error: Unable to register");
          }
        })
        .catch((error) => {
          alert(e, `Error: ${error.message}`, "Error");
        });

        if (isCognitoSignUpSuccessful && isFireStoreSignUpSuccessful) {
            alert("Registration Successfull!")
        } else {
            alert("Error. Unable to Register!")
        }
  }

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
                    type="name"
                    id="typeName-2"
                    className="form-control form-control-lg"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <label className="form-label" htmlFor="typeEmailX-2">
                    Name
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="typeEmailX-2"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <label className="form-label" htmlFor="typeEmailX-2">
                    Email
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="typePasswordX-2"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <label className="form-label" htmlFor="typePasswordX-2">
                    Password
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="phone"
                    className="form-control form-control-lg"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                  />
                  <label className="form-label" htmlFor="phone">
                    Phone Number
                  </label>
                </div>

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
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
