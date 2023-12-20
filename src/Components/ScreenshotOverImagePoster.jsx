import React, { useState, useEffect } from "react";
import "./styles/PlatformGamesData.css";
import axios from "axios";
import { AuthUseContext } from "./context/AuthContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import "./styles/PlatformGamesData.css";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

const ScreenshotOverImagePoster = ({ data }) => {
  const { apiKey } = AuthUseContext();

  const [imageSrc, setImageSrc] = useState([]);

  const getScreenshots = async () => {
    try {
      const response = await axios.get(
        `https://api.rawg.io/api/games/${data}/screenshots?key=${apiKey}`
      );
      setImageSrc(response.data.results.map((data) => data.image));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getScreenshots();
  }, [data, apiKey]);

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
      <AnimatePresence exitBeforeEnter={true} initial={false} custom={direction}>
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
        <div>
          <ArrowLeftIcon style={{ fontSize: "30px" }} />
        </div>
      </div>
    </>
  );
};

export default ScreenshotOverImagePoster;
