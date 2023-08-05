import "./App.css";
import AppNavbar from "./components/NavBar";
import AppRoutes from "./routes";
import KommunicateChat from "./components/Chat";

function App() {
  return (
    <>
    <div>
      <AppNavbar />
      <AppRoutes />
      <KommunicateChat/>
    </div>
    <KommunicateChat/>
    </>
  );
}

export default App;
