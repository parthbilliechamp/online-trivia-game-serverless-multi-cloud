import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import RegistrationPage from "../pages/RegistrationPage";
import BrowseGamePage from "../pages/BrowseGamePage";

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
