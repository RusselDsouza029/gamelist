import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthUseContext } from "./context/AuthContext";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import "./styles/GamePage.css";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const GameScreenshotSlider = ({ gameId }) => {
  const { apiKey } = AuthUseContext();
  const [imageSrc, setImageSrc] = useState([]);
  const [changeMouseCursor, setChangeMouseCursor] = useState("grab");
  const [[page, direction], setPage] = useState([0, 0]);

  const getImage = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`
      );
      setImageSrc(res.data.results.map((data) => data.image));
    } catch (err) {
      console.log(err.message);
    }
  }, [gameId, apiKey]);

  useEffect(() => {
    getImage();
  }, [getImage]);

  const variants = {
    enter: (direction) => ({ x: direction * 1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction * 1000, opacity: 0 }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const paginate = (newDirection) => setPage([page + newDirection, newDirection]);

  const imageIndex = wrap(0, imageSrc.length, page);

  const handleMouseDown = () => setChangeMouseCursor("grabbing");
  const handleMouseUp = () => setChangeMouseCursor("grab");

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <Box
      className="div-game-detail-screenshot"
      sx={{
        position: "relative",
        "@media(max-width: 768px)": {
          width: "100%",
        },
      }}
    >
      <AnimatePresence exitBeforeEnter initial="center" custom={direction}>
        <motion.img
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          key={imageIndex}
          src={imageSrc[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ cursor: changeMouseCursor }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="div-game-detail-screenshot"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
        />
      </AnimatePresence>
      <div className="next-img-slider-btn" onClick={() => paginate(1)}>
        <ArrowRightIcon />
      </div>
      <div className="prev-img-slider-btn" onClick={() => paginate(-1)}>
        <ArrowLeftIcon style={{ fontSize: "30px" }} />
      </div>
    </Box>
  );
};

export default GameScreenshotSlider;
