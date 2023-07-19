import React, { useState, useEffect } from "react";
import profileImage from "../assets/images/profile_template.png";
import AWS from "aws-sdk";

export default function UserProfileComponent() {
  const [userProfile, setUserProfile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedImage, setSelectedImage] = useState(profileImage);

  const S3_BUCKET = "trivia-quiz-app";
  const REGION = "us-east-1";

  AWS.config.update({
    accessKeyId: "ASIATJZBBY7B2PQAWWQ4",
    secretAccessKey: "trmyRfsHltdprK7kCLL2mzpI1jKmlW6LW8m2AhKC",
    sessionToken:
      "FwoGZXIvYXdzEAMaDA/UpzZGPyVD7qccViLCAT/aec7DHxWE3vdKr6yYujr5RLNH5mP69IJnAd+3rnJHHlXDmqUnlvT0ECd96aYqI1ZIDNC6lu0f86nejioUk8QhxgS4h848jMRWtVgiGoR7gbLxjcvRaXstDoSIpe940Mwrhv9BrdGyvcx319IpzFpzPjPZX1KSukZHulCLbsltAbHUJ5JBIHo7Ujjt/FRsHyDY/0stGUNWaoBYNhFsGuWJD7vOOndEOYx6NavlK1w+cJrkS9JmBINF2f9kxlcBwhP/KLWj26UGMi2g/Wm9S8IcaPnD1U1uiI9AbBXDdKk4mxbcs8kpOzGFmbAZprtov5nv8phIko4=",
  });

  const params = {
    Body: profilePicture,
    Bucket: S3_BUCKET,
    Key: `user-profile-picture/pr514457@dal.ca.jpg`,
  };

  const s3Bucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        //TODO the email should not be hardcoded
        const response = await fetch(
          `https://weht3uyg675anzif6r77wydli40iazwt.lambda-url.us-east-1.amazonaws.com?email=pr514457@dal.ca`
        );
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserProfilePicture = async () => {
      try {
        const params = {
          Bucket: S3_BUCKET,
          Key: `user-profile-picture/8861.jpg`,
        }
        const promise = s3Bucket.getSignedUrlPromise("getObject", params);
        promise.then(
          function (url) {
            console.log("here")
            console.log(url);
            setSelectedImage(url);
          },
          function (err) {
            console.log(err);
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
    fetchUserProfilePicture();
  }, []);

  //TODO implmenet a lambda function to update dynamoDB
  const handleUpdateProfile = async () => {
    try {
      await fetch(
        "https://weht3uyg675anzif6r77wydli40iazwt.lambda-url.us-east-1.amazonaws.com/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
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
        )
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button className="btn btn-primary ml-3" onClick={handleImageSubmit}>
          Upload Image
        </button>
      </div>
      <div className="mb-3">
        <label>Email: </label>
        <input
          type="text"
          className="form-control"
          value={userProfile.Email}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Name: </label>
        <input
          type="text"
          className="form-control"
          value={userProfile.Name}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Phone Number : </label>
        <input
          type="text"
          className="form-control"
          value={userProfile.Contact}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleUpdateProfile}>
          Update
        </button>
      </div>
    </div>
  );
}
