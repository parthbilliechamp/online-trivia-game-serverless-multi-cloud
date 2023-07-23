import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import RegistrationPage from "../pages/RegistrationPage";
import SecondFactorAuthenticationPage from "../pages/SecondFactorAuthenticationPage";
import UserProfilePage from "../pages/UserProfilePage";
import UserStatsPage from "../pages/UserStatsPage";
import Test from "../components/test";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sfa" element={<SecondFactorAuthenticationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/stats" element={<UserStatsPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
