import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ConfigurationScreen from "./components/ConfigurationScreen";
import PatientDashboard from "./components/PatientDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/config" element={<ConfigurationScreen />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;