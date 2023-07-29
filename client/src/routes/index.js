import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import SecondFactorAuthenticationPage from "../pages/SecondFactorAuthenticationPage";
import UserProfilePage from "../pages/UserProfilePage";
import UserStatsPage from "../pages/UserStatsPage";
import Test from "../components/test";
import Leaderboard from "../components/Leaderboard";
import TopLeaderStats from "../components/TopLeaderStats";
import CompareUserStats from "../components/CompareUserStats";
import TeamsStatisticsPage from "../pages/TeamsStatisticsPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/sfa" element={<SecondFactorAuthenticationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/stats" element={<UserStatsPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/top-leader-stats" element={<TopLeaderStats />} />
        <Route path="/team-stats" element={<TeamsStatisticsPage />} />
        <Route path="/user-stats" element={<UserStatsPage />} />
        <Route path="/compare-stats" element={<CompareUserStats />} />
        <Route path="/logout" element={<CompareUserStats />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
