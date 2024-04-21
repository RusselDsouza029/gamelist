import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthUseContext } from "./context/AuthContext";
import axios from "axios";
import { Box, CircularProgress, Grid } from "@mui/material";
import GameData from "./GameData";
import "./styles/PlatformGamesData.css";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// data is coming from parent components
const PlatformGamesData = () => {
  const { API_URL, HandleDisplayGrid, changeGridWidth, changeWidth } =
    AuthUseContext();

  const { id } = useParams();

  useEffect(() => {
    switch (id) {
      case "18":
        document.title = "Game List - Playstation 4 Games";
        break;
      case "187":
        document.title = "Game List - Playstation 5 Games";
        break;
      case "1":
        document.title = "Game List - Xbox One Games";
        break;
      case "186":
        document.title = "Game List - Xbox Series X Games";
        break;
      case "7":
        document.title = "Game List - Nintendo Switch Games";
        break;
      case "4":
        document.title = "Game List - PC Games";
        break;
      case "3":
        document.title = "Game List - IOS Games";
        break;
      case "21":
        document.title = "Game List - Android Games";
        break;
      default:
        document.title = "Game List - Home";
    }
  }, [id]);

  // storing game data for PlatformGame Component
  const [fetchGamesData, setfetchGamesData] = useState([]);

  const [loadingCircle, setLoadingCircle] = useState(true);

  const [openErrorSnackbar, setOpenErrorSnackBar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenErrorSnackBar(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  function fetchPlatformGameData() {
    axios
      .get(
        `${API_URL}&platforms=${id}&dates=2022-01-01,2022-12-30&page_size=100`
      )
      .then((res) => {
        // setfetchGamesData((gameData) => [...gameData, ...res.data.results]);
        setfetchGamesData(res.data.results);
        setLoadingCircle(false);
      })
      .catch((err) => {
        console.log(err);
        setOpenErrorSnackBar(true);
        setLoadingCircle(false);
      });
  }

  useEffect(() => {
    setfetchGamesData([]);
    fetchPlatformGameData();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          An error ocurred please chack your internet and refresh the page.
        </Alert>
      </Snackbar>
      <motion.div
        initial="hide"
        whileInView="view"
        viewport={{ once: true }}
        variants={{
          view: { opacity: 1, y: 0 },
          hide: { opacity: 0, y: 100 },
        }}
        transition={{ duration: 1, delay: 1 }}
      >
        {loadingCircle ? (
          <div className="div-progress-bar">
            <div className="div-loading-progress">
              <CircularProgress
                sx={{
                  color: "white",
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="div-parent-grid-title">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <HandleDisplayGrid />
              </Box>
            </div>
            <Grid
              container
              item
              lg={12}
              md={12}
              sx={{
                ml: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                marginTop: 5,
              }}
            >
              <GameData
                data={fetchGamesData}
                changeGridWidth={changeGridWidth}
                changeWidth={changeWidth}
              />
            </Grid>
          </>
        )}
      </motion.div>
    </>
  );
};

export default PlatformGamesData;
