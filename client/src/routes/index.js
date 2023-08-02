import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import RegistrationPage from "../pages/RegistrationPage";
import BrowseGamePage from "../pages/BrowseGamePage";
import CreateTeamPage from "../pages/CreateTeamPage";
import InvitedUserPage from "../pages/InvitedUserPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sfa" element={<Dashboard />} />
        <Route path="/browsegame" element={<BrowseGamePage />} />
        <Route path="/inviteduser" element={<InvitedUserPage />} />
        <Route path="/CreatTeam" element={<CreateTeamPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
