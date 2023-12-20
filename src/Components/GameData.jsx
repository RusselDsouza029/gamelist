import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthUseContext } from "./context/AuthContext";
import { Box, Typography, Divider, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { BsCardImage } from "react-icons/bs";
import CloseIcon from "@mui/icons-material/Close";
import ScreenshotOverImagePoster from "./ScreenshotOverImagePoster";
import SaveOrRemoveList from "./SaveOrRemoveList";
import "./styles/PlatformGamesData.css";

const GameData = ({ data, changeGridWidth, changeWidth }) => {
  const { divGameImg, user } = AuthUseContext();
  const [showScreenshotsOverPoster, setShowScreenshotsOverPoster] = useState(false);
  const [gameScreenshotId, setGameScreenshotId] = useState();

  const showScreenshotImagePopup = (data) => {
    setShowScreenshotsOverPoster(true);
    setGameScreenshotId(data);
    document.body.style.overflow = "hidden";
  };

  const hideScreenshotImagePopup = () => {
    setShowScreenshotsOverPoster(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        hideScreenshotImagePopup();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

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

  return (
    <>
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
              <ScreenshotOverImagePoster data={gameScreenshotId} />
            </Box>
          </Box>
        </motion.div>
      )}

      {data.map((game, index) => (
        <motion.div
          key={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            width: changeWidth,
            height: "auto",
          }}
        >
          <Box
            sx={{
              width: changeGridWidth,
              margin: "10px",
            }}
            className="div-game-container"
          >
            <Box className="similer-game-container">
              <Box className="box-similer-games-img-container">
                <Box className="box-rating">
                  <Typography component="p" className="typo-rating">
                    <StarIcon />
                    {game.rating}
                  </Typography>
                </Box>
                <Box className="div-screenshot-container"></Box>
                <Box className="div-image-icon">
                  <Tooltip title="View Screenshots" arrow placement="bottom">
                    <Box
                      className="div-screenshot-img"
                      onClick={() => showScreenshotImagePopup(game.id)}
                    >
                      <BsCardImage style={{ fontSize: "25px" }} />
                    </Box>
                  </Tooltip>
                  {user && <SaveOrRemoveList gameId={game.id} />}
                </Box>
                <img alt="" src={game.background_image} className={divGameImg} style={{ width: "100%" }} />
              </Box>
              <Link to={`/game/${game.id}`} style={{ color: "white", textDecoration: "none" }}>
                <Box className="box-similer-game-details">
                  <Typography component="p" className="typo-game-series">
                    {game.name}
                  </Typography>
                  <Divider
                    sx={{
                      borderColor: "#303030",
                      marginTop: "7px",
                    }}
                    className="similer-games-divider"
                  />
                  <Box className="box-release-and-genre-parent">
                    <ReleaseAndGenre label="Release Date" value={game.released} />
                    <ReleaseAndGenre label="Genre" value={getGenres(game.genres)} />
                    <ReleaseAndGenre label="Platform" value={getPlatforms(game.platforms)} />
                  </Box>
                </Box>
              </Link>
            </Box>
          </Box>
        </motion.div>
      ))}
    </>
  );
};

const ReleaseAndGenre = ({ label, value }) => (
  <Box className="box-release-and-genre-container" sx={{ marginTop: "5px" }}>
    <Typography component="p">{label}</Typography>
    <Typography component="p" className="typo-genres-value">
      {value}
    </Typography>
  </Box>
);

const getGenres = (genres) => {
  const countGameGenre = genres.length <= 1 ? 0 : Math.min(1, genres.length - 2);
  return genres
    .map((genre, ind) => (ind <= 1 ? `${ind ? ", " : " "}${genre.name}` : null))
    .filter(Boolean)
    .concat(countGameGenre <= 1 ? [] : [`... +${genres.length - 2}`])
    .join("");
};

const getPlatforms = (platforms) => {
  const countPlatform = platforms.length <= 1 ? 0 : Math.min(1, platforms.length - 2);
  return platforms
    .map((platform, ind) => (ind <= 1 ? `${ind ? ", " : " "}${platform.platform.name}` : null))
    .filter(Boolean)
    .concat(countPlatform <= 1 ? [] : [`... +${platforms.length - 2}`])
    .join("");
};

export default GameData;
