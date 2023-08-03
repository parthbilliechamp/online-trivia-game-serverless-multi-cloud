import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GCP_API_GATEWAY_URL,
  APP_LOGIN_URL,
  GCP_API_GATEWAY_KEY,
} from "../constants";
import { Container, Row, Col } from 'react-bootstrap';

export default function RegisterationComponent() {
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [a1, setA1] = useState(null);
  const [a2, setA2] = useState(null);
  const [a3, setA3] = useState(null);

  const location = useLocation();
  // const { userData } = location.state;
  const {userData}= {"email":"pr514457@dal.ca","email_verified":"true","name":"Parth","phone_number":"+17828820163","phone_number_verified":"false","sub":"7478c468-a061-7014-b965-f389930bf5f4","username":"7478c468-a061-7014-b965-f389930bf5f4"}
  const QNA_URL = `https://us-central1-my-project-1513564562994.cloudfunctions.net/user_registration`;

  const handleSignUp = (e) => {
    e.preventDefault();

    const data = {
      q1: q1,
      q2: q2,
      q3: q3,
      a1: a1,
      a2: a2,
      a3: a3,
      email: userData.email
    }

    fetch(QNA_URL, {
      method: "POST",
      body: JSON.stringify(data),
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

    <section>
  

    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-7">
          <div
            className="card shadow-2-strong"
         
          >
                <header style={{ backgroundColor: 'rgb(39, 83, 148)',padding: '20px 0', textAlign: 'center' }}>
                <h3 style={{ color: 'white' }}>Sign Up</h3>
                  </header>
            <div className=" card-body p-5">
             
            <Row>
      <Col xs={12} md={6}>
          
      <div className="form-outline mb-4">
            <label className="form-label" htmlFor="q1">
                <b>Question 1 :</b>
              </label>
              <input
                type="location"
                id="q1"
                className="form-control form-control-lg"
                value={q1}
                onChange={(event) => setQ1(event.target.value)}
              />
            
            </div>
          </Col>
      <Col xs={12} md={6}>
    
      <div className="form-outline mb-4">
            <label className="form-label" htmlFor="a1">
                <b>Answer 1 :</b>
              </label>
              <input
                type="text"
                id="a1"
                className="form-control form-control-lg"
                value={a1}
                onChange={(event) => setA1(event.target.value)}
              />
             
            </div>
    
      </Col>
      <Col xs={12} md={6}>
      <div className="form-outline mb-4">
            <label className="form-label" htmlFor="q2">
               <b> Question 2 :</b>
              </label>
              <input
                type="location"
                id="q2"
                className="form-control form-control-lg"
                value={q2}
                onChange={(event) => setQ2(event.target.value)}
              />
             
            </div>

        </Col>

        <Col xs={12} md={6}>   <div className="form-outline mb-4">
            <label className="form-label" htmlFor="a2">
                <b>Answer 2 :</b>
              </label>
              <input
                type="text"
                id="a2"
                className="form-control form-control-lg"
                value={a2}
                onChange={(event) => setA2(event.target.value)}
              />
             
            </div></Col>
        <Col xs={12} md={6}>   <div className="form-outline mb-4">
            <label className="form-label" htmlFor="q3">
               <b> Question 3 :</b>
              </label>
              <input
                type="text"
                id="q3"
                className="form-control form-control-lg"
                value={q3}
                onChange={(event) => setQ3(event.target.value)}
              />
             
            </div></Col>
        <Col xs={12} md={6}>   <div className="form-outline mb-4">
            <label className="form-label" htmlFor="a3">
               <b> Answer 3 :</b>
              </label>
              <input
                type="text"
                id="a3"
                className="form-control form-control-lg"
                value={a3}
                onChange={(event) => setA3(event.target.value)}
              />
            
            </div></Col>
    </Row>
          
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <button
              className="btn btn-lg btn-block"
              type="submit"
              style={{backgroundColor:'rgb(39, 83, 148)',color:'white',alignContent:'center' }}
              onClick={(e) => handleSignUp(e)}
            >
              Add Security Questions
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
