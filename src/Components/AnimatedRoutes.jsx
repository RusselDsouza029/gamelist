import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./Home";
import GamePage from "./GamePage";
import PlatformGamesData from "./PlatformGamesData";
import List from "./List";
import NotFound from "./NotFound";

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};

const slideVariants = {
  initial: { opacity: 0, top: "100%", bottom: "auto", position: "relative" },
  in: { opacity: 1, top: 0, bottom: "auto" },
  out: { opacity: 0, top: "auto", bottom: "100%" },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={slideVariants}
              transition={{ ...pageTransition, ease: [0.87, 0, 0.13, 1] }}
              style={{ position: "relative" }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/game/:id"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={slideVariants}
              transition={{ ...pageTransition, ease: [0.87, 0, 0.13, 1] }}
              style={{ position: "relative" }}
            >
              <GamePage />
            </motion.div>
          }
        />
        <Route
          path="/platform/:id"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={slideVariants}
              transition={{ ...pageTransition, ease: [0.87, 0, 0.13, 1] }}
              style={{ position: "relative" }}
            >
              <PlatformGamesData />
            </motion.div>
          }
        />
        <Route
          path="/list"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={slideVariants}
              transition={{ ...pageTransition, ease: [0.87, 0, 0.13, 1] }}
              style={{ position: "relative" }}
            >
              <List />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={slideVariants}
              transition={{ ...pageTransition, ease: [0.87, 0, 0.13, 1] }}
              style={{ position: "relative" }}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
