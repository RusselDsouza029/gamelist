import axios from "axios";
import React, { useEffect, useState } from "react";
import { CircularProgress, Snackbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "./styles/Home.css";
import GameData from "./GameData";
import { AuthUseContext } from "./context/AuthContext";
import MuiAlert from "@mui/material/Alert";

const Home = React.memo(function Home() {
  const {
    API_URL,
    HandleDisplayGrid,
    changeGrid,
    changeGridWidth,
    changeWidth,
  } = AuthUseContext();

  const [homeGameData, setHomeGameData] = useState([]);
  const [openErrorSnackbar, setOpenErrorSnackBar] = useState(false);
  const [loadingCircle, setLoadingCircle] = useState(true);

  useEffect(() => {
    const fetchAllGameData = () => {
      axios
        .get(`${API_URL}&dates=2022-01-01,2022-12-30`)
        .then((res) => {
          setHomeGameData(res.data.results);
          setLoadingCircle(false);
        })
        .catch((err) => {
          setLoadingCircle(false);
          console.error(err);
          setOpenErrorSnackBar(true);
        });
    };

    fetchAllGameData();
    document.title = "Game List - Home";
    // eslint-disable-next-line
  }, [API_URL]);

  const handleCloseSnackbar = () => {
    setOpenErrorSnackBar(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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
          An error occurred. Please check your internet connection and refresh the page.
        </Alert>
      </Snackbar>
      <div>
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
              lg={changeGrid}
              xs
              sm
              md={changeGrid}
              item
              sx={{
                ml: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                marginTop: 5,
              }}
            >
              <GameData
                data={homeGameData}
                changeGridWidth={changeGridWidth}
                changeWidth={changeWidth}
              />
            </Grid>
          </>
        )}
      </div>
    </>
  );
});

export default Home;
