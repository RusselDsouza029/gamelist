import React, { useState } from "react";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthUseContext } from "./context/AuthContext";
import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useEffect } from "react";
import "./styles/PlatformGamesData.css";
import ScreenshotOverImagePoster from "./ScreenshotOverImagePoster";
import { BsCardImage } from "react-icons/bs";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import SaveOrRemoveList from "./SaveOrRemoveList";

// data is coming from parent components
const GameData = ({ data, changeGridWidth, changeWidth }) => {
  const { divGameImg, user } = AuthUseContext();

  let countPlatform = 0;

  const [showScreenshotsOverPoster, setShowScreenshotsOverPoster] =
    useState(false);

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

  const screenshotPopupAnimation = {
    enter: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
      visibility: "visible",
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
      transitionEnd: {
        visibility: "hidden",
      },
    },
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    function handleKeydown(event) {
      if (event.keyCode === 27) {
        hideScreenshotImagePopup();
      }
    }
  }, []);

  let countGameGenre = 0;

  return (
    // game screenshot popup
    <>
      {showScreenshotsOverPoster ? (
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
            <Box
              className="div-pop-close"
              onClick={hideScreenshotImagePopup}
            ></Box>
            <Box className="div-pop-content">
              <ScreenshotOverImagePoster data={gameScreenshotId} />
            </Box>
          </Box>
        </motion.div>
      ) : null}
      {/* games data  */}
      {data.map((data, index) => {
        return (
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
                      {data.rating}
                    </Typography>
                  </Box>
                  <Box className="div-screenshot-container">
                  </Box>
                  <Box className="div-image-icon">
                    <Tooltip title="View Screenshots" arrow placement="bottom">
                      <Box
                        className="div-screenshot-img"
                        onClick={() => showScreenshotImagePopup(data.id)}
                      >
                        <BsCardImage style={{ fontSize: "25px" }} />
                      </Box>
                    </Tooltip>
                    {user ? <SaveOrRemoveList gameId={data.id} /> : null}
                  </Box>
                  <img
                    alt=""
                    src={data.background_image}
                    className={divGameImg}
                    style={{
                      width: "100%",
                    }}
                  />
                </Box>
                <Link
                  to={`/game/${data.id}`}
                  style={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  <Box className="box-similer-game-details">
                    <Typography component="p" className="typo-game-series">
                      {data.name}
                    </Typography>
                    <Divider
                      sx={{
                        borderColor: "#303030",
                        marginTop: "7px",
                      }}
                      className="similer-games-divider"
                    />
                    <Box className="box-release-and-genre-parent">
                      <Box className="box-release-and-genre-container">
                        <Typography component="p">Release Date</Typography>
                        <Typography component="p">{data.released}</Typography>
                      </Box>
                      <Divider
                        sx={{
                          borderColor: "#303030",
                          marginTop: "7px",
                        }}
                        className="similer-games-divider"
                      />
                      <Box
                        className="box-release-and-genre-container"
                        sx={{ marginTop: "5px" }}
                      >
                        <Typography component="p">Genre</Typography>
                        <Typography component="p" className="typo-genres-value">
                          {data.genres.map((genre, ind) => {
                            if (ind <= 3) {
                              countGameGenre = ind;
                            }
                            return (
                              <Typography component="span" key={genre.id}>
                                {ind <= 1 ? (
                                  <>{(ind ? ", " : " ") + genre.name}</>
                                ) : null}
                              </Typography>
                            );
                          })}
                          {countGameGenre <= 1 ? null : (
                            <>, ...+{data.genres.length - 2}</>
                          )}
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          borderColor: "#303030",
                          marginTop: "7px",
                        }}
                        className="similer-games-divider"
                      />
                      <Box
                        className="box-release-and-genre-container"
                        sx={{ marginTop: "5px" }}
                      >
                        <Typography component="p">Platform</Typography>
                        <Typography component="p" className="typo-genres-value">
                          {data.platforms.map((platform, ind) => {
                            if (ind <= 3) {
                              countPlatform = ind;
                            }
                            return (
                              <Typography component="span" key={ind}>
                                {ind <= 1 ? (
                                  <>
                                    {(ind ? ", " : " ") +
                                      platform.platform.name}
                                  </>
                                ) : null}
                              </Typography>
                            );
                          })}
                          {countPlatform <= 1 ? null : (
                            <>, ...+{data.platforms.length - 2}</>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </>
  );
};

export default GameData;
