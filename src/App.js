import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ConfigurationScreen from "./components/ConfigurationScreen";
import PatientDashboard from "./components/PatientDashboard";
import InstallPWA from "./components/InstallPWA";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <InstallPWA />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/config" element={<ConfigurationScreen />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
      </Routes>
      
    </Router>
  );
}

export default App;