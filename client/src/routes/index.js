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
import QuizPage from "../pages/QuizPage";
import ResultPage from "../pages/ResultPage"
import AdminDashboard from "../components/AdminDashboard";

import { ToastContainer } from "react-toastify";

import QuestionForm from "../components/AddQuestion";
import QuestionList from "../components/DisplayQuestion";
import UpdateQuestion from "../components/UpdateQuestion";
import DisplayGames from "../components/game/DisplayGame";
import AddGame from "../components/game/AddGame";
import UpdateGame from "../components/game/UpdateGame";
import GameQuestionPage from "../components/game/GameAddQuestion";
import UpdateGameQuestion from "../components/game/UpdateGameQuestion";
import HomePage from "../components/HomePage";
import LoginRedirect from "../components/LoginRedirect";
import BrowseGamePage from "../pages/BrowseGamePage";
import CreateTeamPage from "../pages/CreateTeamPage";
import InvitedUserPage from "../pages/InvitedUserPage";
import LobbyPage from "../pages/LobbyPage";
import Logout from "../components/Logout";
import KommunicateChat from "../components/Chat";
import TeamMemberList from "../components/TeamMemberList";
import AdminHomePage from "../components/AdminHomePage"

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
        <Route path="/logout" element={<Logout />} />
        <Route path="/addquestion" element={<QuestionForm />} />
        <Route path="/admin" element={<HomePage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminhome" element={<AdminHomePage />} />



        <Route path="/aihelp" element={<KommunicateChat />} />

        <Route path="/getquestion" element={<QuestionList />} />
        <Route
          path="/updatequestion/:questionId"
          element={<UpdateQuestion />}
        />
        <Route path="/updategame/:gameId" element={<UpdateGame />} />

        <Route path="/getgames" element={<DisplayGames />} />
        <Route path="/gamequestion/:gameId" element={<GameQuestionPage />} />
        <Route
          path="/updategamequestion/:gameId"
          element={<UpdateGameQuestion />}
        />

        <Route path="/addgame" element={<AddGame />} />
        <Route path="/browsegame" element={<BrowseGamePage />} />
        <Route path="/inviteduser" element={<InvitedUserPage />} />
        <Route path="/createTeam" element={<CreateTeamPage />} />
        <Route path="/InviteUser" element={<TeamMemberList />} />
        <Route path="/lobby/:gameId" element={<LobbyPage />} />

        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
