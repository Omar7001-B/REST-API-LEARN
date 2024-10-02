// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import SubscribersTable from "./components/SubscribersTable";
import ModInfo from "./components/ModInfo";
import Peers from "./components/Peers";
import DefaultPage from "./components/DefaultPage";
import Statistics from "./components/Statistics";
import Log from "./components/Log";
import ManagerLog from "./components/ManagerLog";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />}>
              <Route index element={<DefaultPage />} /> {/* Default page */}
              <Route path="subscribers" element={<SubscribersTable />} />
              <Route path="settings" element={<ModInfo />} />
              <Route path="peers" element={<Peers />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="log" element={<Log />} />
              <Route path="manager-log" element={<ManagerLog />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
