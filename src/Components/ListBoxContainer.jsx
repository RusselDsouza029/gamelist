import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AuthUseContext } from "./context/AuthContext";
import { motion } from "framer-motion";
import "./styles/List.css";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PopupScreenshotComponent from "./PopupScreenshotComponent";
import { BsCardImage } from "react-icons/bs";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

const ListBoxContainer = ({ gameId, id, getData }) => {
  // Accessing authentication context
  const { apiKey, user } = AuthUseContext();

  // State to store game data, genres, and platforms
  const [gameDataInfo, setGameDataInfo] = useState([]);
  const [gameDataInfoGenre, setGameDataInfoGenre] = useState([]);
  const [gameDataInfoPlatforms, setGameDataInfoPlatforms] = useState([]);

  // Function to fetch game data
  const getGameData = () => {
    axios
      .get(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
      .then((res) => {
        setGameDataInfo(res.data);
        setGameDataInfoGenre(res.data.genres);
        setGameDataInfoPlatforms(res.data.platforms);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Function to delete game info from Firebase
  const deleteGameInfoFirebase = async (id) => {
    await deleteDoc(doc(db, user ? user.uid : "0", id));
    getData();
    getGameData();
  };

  // Variables to count the number of displayed genres and platforms
  let countPlatforms = 0;
  let countGenre = 0;

  // useEffect to fetch game data on component mount
  useEffect(() => {
    getGameData();
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div className="div-list-data-container">
      {gameDataInfo.background_image ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
        >
          {/* Display game information */}
          <Box className="div-list-game-container">
            <Box className="div-list-img-container">
              <img
                src={gameDataInfo.background_image}
                alt={gameDataInfo.name}
                className="game-list-img-poster"
              />
              <Box className="div-game-list-rating">
                {/* Popup for screenshots */}
                <Box className="div-screenshot-and-remove-list">
                  <Box>
                    <PopupScreenshotComponent
                      ImageIconComponent={BsCardImage}
                      id={gameId}
                    />
                  </Box>
                  {/* Delete game button */}
                  <Box>
                    <IconButton
                      onClick={() => {
                        deleteGameInfoFirebase(id);
                      }}
                      sx={{ color: "white" }}
                    >
                      <PlaylistRemoveIcon />
                    </IconButton>
                  </Box>
                </Box>
                {/* Display game rating */}
                <Box className="rating-list-data">
                  <StarIcon />
                  {gameDataInfo.rating}
                </Box>
              </Box>
            </Box>
            <Box className="div-data-info">
              {/* Link to the game details page */}
              <Link to={`/game/${gameDataInfo.id}`}>
                {/* Display game name */}
                <Typography component="p" className="p-list-game-name">
                  {gameDataInfo.name}
                </Typography>
                <Box>
                  {/* Divider and release date */}
                  <Divider className="list-hr" />
                  <Box className="div-list-data-info-container">
                    Release Date
                    <Typography component="span">
                      {gameDataInfo.released}
                    </Typography>
                  </Box>
                </Box>
                {/* Divider and genres */}
                <Divider className="list-hr" />
                <Box className="div-list-data-info-container">
                  <Box>Genre</Box>
                  <Box>
                    {gameDataInfoGenre.map((genre, ind) => {
                      if (ind <= 3) {
                        countGenre = ind;
                      }
                      return (
                        <Typography component="span" key={genre.id}>
                          {ind <= 1 ? (
                            <>{(ind ? " ," : " ") + genre.name}</>
                          ) : null}
                        </Typography>
                      );
                    })}
                    {countGenre <= 1 ? null : (
                      <>, ...+{gameDataInfoGenre.length - 2}</>
                    )}
                  </Box>
                </Box>
                {/* Divider and platforms */}
                <Divider className="list-hr" />
                <Box className="div-list-data-info-container">
                  <Box>Platforms</Box>
                  <Box>
                    {gameDataInfoPlatforms.map((platform, ind) => {
                      if (ind <= 3) {
                        countPlatforms = ind;
                      }
                      return (
                        <Typography component="span" key={platform.platform.id}>
                          {ind <= 1 ? (
                            <>{(ind ? " ," : " ") + platform.platform.name}</>
                          ) : null}
                        </Typography>
                      );
                    })}
                    {countPlatforms <= 1 ? null : (
                      <>, ...+{gameDataInfoPlatforms.length - 2}</>
                    )}
                  </Box>
                </Box>
              </Link>
            </Box>
          </Box>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
          style={{
            marginBottom: "10px",
          }}
        >
          {/* Skeleton loading for game information */}
          <Skeleton
            className="game-list-img-poster list-data-skeleton"
            variant="rectangular"
            sx={{
              my: 2,
            }}
          />
          <Skeleton className="list-line-skeleton" />
          <Box className="div-list-data-info-container skeleton-genre-container">
            <Skeleton className="list-line-skeleton list-genre-platform-data-skeleton" />
            <Skeleton className="list-line-skeleton list-genre-platform-data-skeleton" />
          </Box>
          <Box className="div-list-data-info-container skeleton-genre-container">
            <Skeleton className="list-line-skeleton list-genre-platform-data-skeleton" />
            <Skeleton className="list-line-skeleton list-genre-platform-data-skeleton" />
          </Box>
          <Box className="div-list-data-info-container skeleton-genre-container">
            <Skeleton className="list-line-skeleton list-genre-platform-data-skeleton" />
            <Skeleton className="list-line-skeleton list-genre-platform-data-skeleton" />
          </Box>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ListBoxContainer;
