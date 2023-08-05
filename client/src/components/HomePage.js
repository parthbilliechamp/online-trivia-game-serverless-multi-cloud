import React from 'react';
import { Link } from 'react-router-dom';
import gamesImage from '../assets/images/trivia1.jpg'; 
import questionsImage from '../assets/images/question.jpg';
import triviaImage from '../assets/images/stats.jpg';


const HomePage = () => {
  return (
    <div className="container py-4">
      {/* <div className="text-center mb-4">
        <img src={triviaImage} alt="Trivia" style={{ maxWidth: '100%', height: 'auto' }} />
      </div> */}
      <h1 className="text-center mb-4">Admin Home Page</h1>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100"> 
            <img src={gamesImage} className="card-img-top custom-img" alt="Games" />
            <div className="card-body">
              <h5 className="card-title">Games</h5>
              <p className="card-text">Manage games here.</p>
              <Link to="/getgames" className="btn btn-primary">Go to Games</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={questionsImage} className="card-img-top custom-img" alt="Questions" />
            <div className="card-body">
              <h5 className="card-title">Questions</h5>
              <p className="card-text">Manage questions here.</p>
              <Link to="/getquestion" className="btn btn-primary">Go to Questions</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={triviaImage} className="card-img-top custom-img" alt="Data" />
            <div className="card-body">
              <h5 className="card-title">Data</h5>
              <p className="card-text">View data and statistics here.</p>
              <Link to="/admindashboard" className="btn btn-primary">Go to Data</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
