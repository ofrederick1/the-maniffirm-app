import logo from "./assets/manniffirm_logo.png";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./pages/Home";
import ContactPage from "./pages/Contact";
import MainHeader from "./components/MainHeader/NavigationBar";

function App() {
  // TODO usestat with token
  // TODO useEffect to savedToken and expiresAt
  // TODO updateToken
  // TODO isLoggedIn to toggle between what you see when youre logged in

  return (
    <Router>
      <MainHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
