import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import ViewPastRecordsPage from "../pages/ViewPastRecordsPage";
import ViewPrediction from "../pages/ViewPrediction";
import Services from "../pages/Services";
import AdminLoginPage from "../pages/AdminLoginPage";
import ServicesAdmin from "../pages/ServicesAdmin";
import TrainModelPage from "../pages/TrainModelPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
