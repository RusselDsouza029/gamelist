import React, { useState, useEffect } from "react";
import { AuthUseContext } from "./context/AuthContext";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import "./styles/PopupScreenshotComponent.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

const PopupScreenshotComponent = ({ ImageIconComponent, id }) => {
  const { apiKey } = AuthUseContext();

  const [showScreenshotsOverPoster, setShowScreenshotsOverPoster] =
    useState(false);

  const showScreenshotImagePopup = () => {
    setShowScreenshotsOverPoster(true);
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "5px";
  };

  const hideScreenshotImagePopup = () => {
    setShowScreenshotsOverPoster(false);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
  };

  const screenshotPopupAnimation = {
    enter: {
      opacity: 1,
      transition: { duration: 0.5 },
      visibility: "visible",
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
      transitionEnd: { visibility: "hidden" },
    },
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleKeydown = (event) => {
    if (event.keyCode === 27) {
      hideScreenshotImagePopup();
    }
  };

  const [imageSrc, setImageSrc] = useState([]);

  useEffect(() => {
    const getScreenshots = async () => {
      try {
        const res = await axios.get(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`
        );
        setImageSrc(res.data.results.map((data) => data.image));
      } catch (err) {
        console.log(err.message);
      }
    };
    getScreenshots();
  }, [id, apiKey]);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
  };

  const swipeConfidenceThreshold = 10000;

  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, imageSrc.length, page);

  const [changeMouseCursor, setChangeMouseCursor] = useState("grab");

  return (
    <>
      <Box onClick={showScreenshotImagePopup} className="div-screenshot-icon">
        <ImageIconComponent />
      </Box>
      {showScreenshotsOverPoster && (
        <motion.div
          className="div-motion-screenshot-popup"
          style={{ zIndex: 100 }}
          initial="exit"
          animate={showScreenshotsOverPoster ? "enter" : "exit"}
          variants={screenshotPopupAnimation}
        >
          <Box className="div-pop-parent">
            <Box className="div-close-icon" onClick={hideScreenshotImagePopup}>
              <CloseIcon />
            </Box>
            <Box className="div-pop-close" onClick={hideScreenshotImagePopup}></Box>
            <Box className="div-pop-content">
              <AnimatePresence exitBeforeEnter custom={direction}>
                <motion.img
                  onMouseDown={() => setChangeMouseCursor("grabbing")}
                  onMouseUp={() => setChangeMouseCursor("grab")}
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
                  }}
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
              <div className="next-img-slider-btn" onClick={() => paginate(1)}>
                <ArrowRightIcon />
              </div>
              <div className="prev-img-slider-btn" onClick={() => paginate(-1)}>
                <ArrowLeftIcon style={{ fontSide: "30px" }} />
              </div>
            </Box>
          </Box>
        </motion.div>
      )}
    </>
  );
};

export default PopupScreenshotComponent;
