import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthUseContext } from "./context/AuthContext";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
// Import css files
import "./styles/GamePage.css";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const GameScreenshotSlider = ({ gameId }) => {
  const { apiKey } = AuthUseContext();

  const [imageSrc, setImageSrc] = useState([]);

  const getImage = () => {
    axios
      .get(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`)
      .then((res) => {
        setImageSrc(res.data.results[page].image);
        setImageSrc(res.data.results.map((data) => data.image));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getImage();
    // eslint-disable-next-line
  }, [gameId]);

  const variants = {
    enter: (direction) => {
      return { x: direction > 0 ? 1000 : -1000, opacity: 0 };
    },
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => {
      return { zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 };
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, imageSrc.length, page);

  const [changeMouseCursor, setChangeMouseCursor] = useState("grab");

  return (
    <React.Fragment>
      <Box
        className="div-game-detail-screenshot"
        sx={{
          position: "relative",
          "@media(max-width: 768px)": {
            width: "100%",
          },
        }}
      >
        <AnimatePresence
          exitBeforeEnter={true}
          initial="center"
          custom={direction}
        >
          <motion.img
            onMouseDown={() => {
              setChangeMouseCursor("grabbing");
            }}
            onMouseUp={() => {
              setChangeMouseCursor("grab");
            }}
            key={imageIndex}
            src={imageSrc[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              cursor: changeMouseCursor,
            }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="div-game-detail-screenshot"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>
        <div className="next-img-slider-btn">
          <div onClick={() => paginate(1)}>
            <ArrowRightIcon />
          </div>
        </div>
        <div className="prev-img-slider-btn" onClick={() => paginate(-1)}>
          <div>
            <ArrowLeftIcon style={{ fontSide: "30px" }} />
          </div>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default GameScreenshotSlider;
