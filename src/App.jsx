import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Splash from "./screens/Splash";
import History from "./screens/History";
import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import RequireAuth from "./screens/RequireAuth";
const App = () => {
  return (
    <div className="h-screen w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Route>
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
