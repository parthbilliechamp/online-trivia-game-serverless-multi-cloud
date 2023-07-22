import React, { useState, useEffect } from "react";
import profileImage from "../assets/images/profile_template.png";
import AWS from "aws-sdk";
import {
  AWS_API_GATEWAY_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SESSION_TOKEN,
  AWS_SECRET_ACCESS_KEY,
} from "../constants";

export default function UserProfileComponent() {
  const [userProfile, setUserProfile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedImage, setSelectedImage] = useState(profileImage);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const S3_BUCKET = "trivia-quiz-app";
  const REGION = "us-east-1";

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  });

  const params = {
    Body: profilePicture,
    Bucket: S3_BUCKET,
    Key: `user-profile-picture/${userData.sub}.jpg`,
  };

  const s3Bucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  useEffect(() => {
    const URL = `${AWS_API_GATEWAY_URL}/user-profile?email=${userData.email}`;
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setUserProfile(data);
        setUserEmail(data.Email);
        setUserName(data.Name);
        setUserContact(data.Contact);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserProfilePicture = async () => {
      try {
        const params = {
          Bucket: S3_BUCKET,
          Key: `user-profile-picture/${userData.sub}.jpg`,
        };

        try {
          s3Bucket.headObject(params);
          const url = await s3Bucket.getSignedUrlPromise("getObject", params);
          console.log(url);
          setSelectedImage(url);
        } catch (err) {
          console.log("Object does not exist or error occurred:");
          console.log(err);
        }
      } catch (error) {
        console.log("Error occurred while checking object existence:");
        console.error(error);
      }
    };

    fetchUserProfile();
    fetchUserProfilePicture();
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const URL = `${AWS_API_GATEWAY_URL}/user-profile`;
    try {
      fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          contact: userContact,
        }),
      }).then(alert("Profile updated successfully!!"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    console.log(selectedImage);
    setProfilePicture(file);
  };

  const handleImageSubmit = async () => {
    try {
      await s3Bucket.putObject(params).promise();
      console.log("uploaded");
    } catch (error) {
      console.error(error);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container" style={{ width: "70%" }}>
      <h1>User Profile</h1>
      <div className="d-flex align-items-center mb-3">
        <img
          src={selectedImage}
          alt="Profile"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          className="mr-3"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button className="btn btn-primary ml-3" onClick={handleImageSubmit}>
          Upload Image
        </button>
      </div>
      <form>
        <div className="mb-3">
          <label>Email: </label>
          <input
            type="text"
            className="form-control"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Name: </label>
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Phone Number : </label>
          <input
            type="text"
            className="form-control"
            value={userContact}
            onChange={(e) => setUserContact(e.target.value)}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              handleUpdateProfile(e);
            }}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
