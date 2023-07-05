import React from 'react';
import UserInformation from '../components/user_profile_management/UserInformation';
import UserStatistics from '../components/user_profile_management/UserStatistics';
import TeamAffiliations from '../components/user_profile_management/TeamAffiliation';

const UserProfilePage = () => {
  return (
    <div className="user-profile-container">
      <h1 className="user-profile-title">User Profile Page</h1>
      <UserInformation />
      <UserStatistics />
      <TeamAffiliations />
    </div>
  );
};

export default UserProfilePage;