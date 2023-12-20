import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./styles/ContentComponentCarousel.css";
import { Box, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthUseContext } from "./context/AuthContext";
import axios from "axios";

const ContentComponentCarousel = ({ id }) => {
  const { apiKey } = AuthUseContext();
  const refCarousel = useRef();
  const [gameDeveloper, setGameDeveloper] = useState([]);
  const [checkCarouselWidth, setCheckCarouselWidth] = useState(0);

  const getGameDeveloperData = async () => {
    try {
      const result = await axios.get(`https://api.rawg.io/api/games/${id}/development-team?key=${apiKey}`);
      setGameDeveloper(result.data.results);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getGameDeveloperData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setCheckCarouselWidth(0);
    if (gameDeveloper.length > 0) {
      setCheckCarouselWidth(
        refCarousel.current.scrollWidth - refCarousel.current.offsetWidth
      );
    }
  }, [gameDeveloper]);

  return (
    <div>
      {gameDeveloper.length > 0 ? (
        <motion.div
          ref={refCarousel}
          className="carousel"
          style={{ cursor: "grab", overflow: "hidden" }}
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            className="inner-carousel"
            style={{
              display: "flex",
            }}
            drag="x"
            dragConstraints={{ right: 0, left: -checkCarouselWidth }}
          >
            {gameDeveloper.map((info, index) => (
              <div key={index} className="div-carousel-content">
                <div className="div-img-container">
                  <div className="div-gradiant-layer-img"></div>
                  <img src={info.image_background} alt={info.name} />
                </div>
                <Box className="div-txt-content">
                  <Box className="div-name">{info.name}</Box>
                  <Box className="div-position-parent">
                    {info.positions.map((data, ind) => (
                      <Box key={ind} className="div-position">
                        {data.name.charAt(0).toUpperCase() + data.name.substring(1)}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mx: 2 }}>
                  <Divider sx={{ borderColor: "#2c2c2c" }} />
                </Box>
                <Box className="div-games" sx={{ px: 2, py: 2 }}>
                  Games
                  <Typography component="p" className="p-games-data-names">
                    {info.games.map((game, ind) => (
                      <Typography
                        component="span"
                        key={ind}
                        className="span-games-name"
                      >
                        <Link to={`/game/${game.id}`}>
                          {(ind ? ", " : " ") + game.name}
                        </Link>
                      </Typography>
                    ))}
                  </Typography>
                </Box>
              </div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#6c6c6c",
          }}
        >
          No Developer Information available
        </Box>
      )}
    </div>
  );
};

export default ContentComponentCarousel;
