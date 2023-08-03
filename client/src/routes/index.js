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
import { ToastContainer } from "react-toastify";

import QuestionForm from "../components/AddQuestion";
import QuestionList from "../components/DisplayQuestion";
import UpdateQuestion from "../components/UpdateQuestion";
import DisplayGames from "../components/game/DisplayGame";
import AddGame from "../components/game/AddGame";
import UpdateGame from "../components/game/UpdateGame";
import GameQuestionPage from "../components/game/GameAddQuestion";
import UpdateGameQuestion from "../components/game/UpdateGameQuestion";
// import GameStats  from '../components/game_stats/GameStats';
import HomePage from "../components/HomePage";
import LoginRedirect from "../components/LoginRedirect";
import BrowseGamePage from "../pages/BrowseGamePage";
import CreateTeamPage from "../pages/CreateTeamPage";
import InvitedUserPage from "../pages/InvitedUserPage";
import LobbyPage from "../pages/LobbyPage";

const AppRoutes = () => {
  return (
    <Router>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LoginRedirect />} />
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
        <Route path="/addquestion" element={<QuestionForm />} />
        <Route path="/admin" element={<HomePage />} />

        <Route path="/getquestion" element={<QuestionList />} />
        <Route
          path="/updatequestion/:questionId"
          element={<UpdateQuestion />}
        />
        <Route path="/updategame/:gameId" element={<UpdateGame />} />
        {/* <Route path="/gamestats" element={<GameStats />} /> */}

        <Route path="/getgames" element={<DisplayGames />} />
        <Route path="/gamequestion/:gameId" element={<GameQuestionPage />} />
        <Route
          path="/updategamequestion/:gameId"
          element={<UpdateGameQuestion />}
        />

        <Route path="/addgame" element={<AddGame />} />
        <Route path="/browsegame" element={<BrowseGamePage />} />
        <Route path="/inviteduser" element={<InvitedUserPage />} />
        <Route path="/CreatTeam" element={<CreateTeamPage />} />
        <Route path="/lobby/:gameId" element={<LobbyPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
