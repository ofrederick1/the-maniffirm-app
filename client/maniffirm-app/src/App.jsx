import logo from "./assets/manniffirm_logo.png";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";



function App() {

  // TODO usestat with token
  // TODO useEffect to savedToken and expiresAt
  // TODO updateToken
  // TODO isLoggedIn to toggle between what you see when youre logged in

  return (
<Router>
  <div className="App">
    <header className="App-header">
   <h1> THE MANIFFIRM APP</h1>
    </header>
  </div>
  <Routes>
    <Route
      path="/login"
      element={<Login />}
    />
  </Routes>
</Router>






    
  );
}

export default App;
