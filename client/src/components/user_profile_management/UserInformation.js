import React from 'react';

const UserInformation = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">User Information</h5>
        <img className="card-img-top" src="path_to_profile_picture" alt="User Profile" />
        <p className="card-text">Name: John Doe</p>
        <p className="card-text">Contact: 1234567890</p>
        <p className="card-text">Email: john@example.com</p>
      </div>
    </div>
  );
};

export default UserInformation;