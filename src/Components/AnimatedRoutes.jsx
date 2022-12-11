import React from "react";
import "../App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import GamePage from "./GamePage";
import NotFound from "./NotFound";
import List from "./List";
import { AnimatePresence } from "framer-motion";
import Home from "./Home";
import PlatformGamesData from "./PlatformGamesData";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/game/:id" element={<GamePage />} />
        <Route exact path="/platform/:id" element={<PlatformGamesData />} />
        <Route exact path="/list" element={<List />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
