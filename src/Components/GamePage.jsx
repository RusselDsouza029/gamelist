import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/GamePage.css";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Grid,
  Typography,
  Skeleton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { db } from "./firebase/FirebaseConfig";
import { AuthUseContext } from "./context/AuthContext";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import GameScreenshotSlider from "./GameScreenshotSlider";
import MuiAlert from "@mui/material/Alert";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { paperClasses } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GameData from "./GameData";
import ContentComponentCarousel from "./ContentComponentCarousel";
import "./styles/PlatformGamesData.css";
import PopupScreenshotComponent from "./PopupScreenshotComponent";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const GamePage = () => {
  // Context and parameters
  const { user, handleGoogleSignIn, apiKey } = AuthUseContext();
  const { id } = useParams();
  const checkUID = user ? user.uid : 0;

  // Firestore collection
  let objData = {
    gameId: id,
  };
  const gameListCollection = collection(db, `${user ? user.uid : 0}`);

  // Function to send game ID to Firestore
  async function sendDataTOFirestore() {
    await addDoc(gameListCollection, objData);
    setTextInsideSnackbar("Added in your List");
    setOpenSuccessSnackBar(true);
  }

  // Function to delete game ID from Firestore
  async function deleteGameData(id) {
    const userDoc = doc(db, user.uid, id);
    await deleteDoc(userDoc);
    checkGameAvailable();
    setTextInsideSnackbar("Removed from your List");
    setOpenSuccessSnackBar(true);
    setCheckId(false);
  }

  // States for API data and various categories
  const [gameData, setGameData] = useState([]);
  const [gameGenre, setGameGenre] = useState([]);
  const [gamePlatform, setGamePlatform] = useState([]);
  const [gamePublishers, setGamePublishers] = useState([]);

  // Fetch game data from API
  function getGameData() {
    axios
      .get(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
      .then((res) => {
        setGameData(res.data);
        setGameGenre(res.data.genres);
        setGamePlatform(res.data.platforms);
        setGamePublishers(res.data.publishers);
        setLoading(false);
        checkGameAvailable();
        document.title = res.data.name;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // State and function for checking game availability in user's list
  const [checkId, setCheckId] = useState();
  const [loading, setLoading] = useState(true);
  const [openSuccessSnackBar, setOpenSuccessSnackBar] = useState(false);
  const [textInsideSnackbar, setTextInsideSnackbar] = useState("");
  const q = query(
    collection(db, `${checkUID}`),
    where("gameId", "==", id)
  );

  // Function to close success snackbar
  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackBar(false);
  };

  // State for storing the ID to be deleted
  const [deleteFromListId, setDeleteFromListId] = useState("");

  // Function to check if the game is available in the user's list
  function checkGameAvailable() {
    onSnapshot(q, (snapshot) => {
      let storeGameData = [];
      snapshot.docs.forEach((doc) => {
        storeGameData.push({ ...doc.data(), id: doc.id });
      });
      if (storeGameData[0]) {
        setDeleteFromListId(storeGameData[0].id);
        setCheckId(storeGameData[0].gameId);
      }
    });
  }

  // State for storing similar game series
  const [similerGameSeries, setSimilerGameSeries] = useState([]);

  // Variable for pagination
  let nextPage = 1;

  // Function to get similar game series
  function getSimilerGameSeries() {
    axios
      .get(
        `https://api.rawg.io/api/games/${id}/game-series?key=${apiKey}&page=${nextPage}`
      )
      .then((result) => {
        nextPage = nextPage + 1;
        setSimilerGameSeries(result.data.results);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // useEffect for fetching similar game series
  useEffect(() => {
    getSimilerGameSeries();
    // eslint-disable-next-line
  }, [id, nextPage]);

  // useEffect for initial game data fetch
  useEffect(() => {
    checkGameAvailable();
    getGameData();
    // eslint-disable-next-line
  }, [id]);

  // useEffect to check game availability when user changes
  useEffect(() => {
    if (user) {
      checkGameAvailable();
    }
    // eslint-disable-next-line
  }, [checkUID, id]);

  // Alert component for success snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // State and functions for specification dialog
  const [openSpecificationPopup, setOpenSpecificationPopup] = useState(false);
  const [platformSpecificationName, setPlatformSpecificationName] = useState("");
  const [platformSpecificationValueData, setPlatformSpecificationValueData] =
    useState({});
  const handleOpenSpecificationPop = ({ platformName, specificationData }) => {
    setOpenSpecificationPopup(true);
    setPlatformSpecificationName(platformName);
    setPlatformSpecificationValueData(specificationData);
  };
  const handleCloseSpecificationPop = () => {
    setOpenSpecificationPopup(false);
  };

  // Media query and theme for specification dialog
  const mediaTheme = useTheme();
  const fullScreenSpecificationMedia = useMediaQuery(
    mediaTheme.breakpoints.down("md")
  );

  // State for specification tab value
  const [specificationTabValue, setSpecificationTabValue] = useState(0);

  // Function to handle tab value change
  const handleChangeTabValues = ({ val }) => {
    setSpecificationTabValue(val);
  };

  return (
    <>
      {/* dialog for specification */}
      <Dialog
        open={openSpecificationPopup}
        fullScreen={fullScreenSpecificationMedia}
        onClose={handleCloseSpecificationPop}
        aria-labelledby="responsive-dialog-title"
        sx={{
          [`& .${paperClasses.root}`]: {
            color: "white",
            backgroundColor: "#151515",
            width: "100%",
          },
        }}
      >
        <Box className="div-dialog-title">
          {platformSpecificationName} Specification
          <Box
            className="div-dialog-close"
            onClick={handleCloseSpecificationPop}
          >
            <CloseIcon />
          </Box>
        </Box>
        <Box className="div-spec-parent-tab">
          {Object.keys(platformSpecificationValueData)[0] ? (
            <>
              {Object.keys(platformSpecificationValueData).map((data, ind) => {
                return (
                  <Box
                    key={ind}
                    className="div-spec-tab"
                    onClick={() => handleChangeTabValues({ val: ind })}
                    sx={{
                      color: ind === specificationTabValue ? "white" : "gray",
                      borderBottom:
                        ind === specificationTabValue
                          ? "2px solid white"
                          : "2px solid transparent",
                    }}
                  >
                    {data.charAt(0).toUpperCase() + data.substring(1)}
                  </Box>
                );
              })}
            </>
          ) : (
            <Box className="div-no-spec">No Specification Available</Box>
          )}
        </Box>
        <Box className="div-specification-dIscreption">
          {Object.values(platformSpecificationValueData).map((data, ind) => {
            return <Box key={ind}>{ind === specificationTabValue && data}</Box>;
          })}
        </Box>
      </Dialog>
      <Snackbar
        open={openSuccessSnackBar}
        autoHideDuration={2000}
        onClose={handleCloseSuccessSnackbar}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {textInsideSnackbar}
        </Alert>
      </Snackbar>
      <motion.div
        transition={{ duration: 0.5 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
      >
        <div
          className="div-head"
          style={{
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          {loading ? (
            <React.Fragment>
              {/* loading till data from api is not fetch */}
              <Box sx={{ width: "100%" }}>
                <Grid container spacing={6}>
                  <Grid
                    className="div-poster-img"
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        marginLeft: "10px",
                        width: "100%",
                        height: "400px",
                      }}
                    >
                      <Skeleton
                        className="loading-skeleton"
                        width="90%"
                        height="100%"
                        variant="rectangular"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Box
                      sx={{
                        paddingRight: 5,
                        fontSize: 27,
                        "@media (max-width: 768px)": {
                          paddingLeft: 5,
                        },
                        "@media (max-width: 426px)": {
                          paddingLeft: "10px",
                        },
                      }}
                    >
                      {/* title */}
                      <Typography component="h1" className="typo__content">
                        <Skeleton
                          width="100px"
                          className="loading-skeleton text-skeleton"
                        />
                        <Skeleton
                          width="300px"
                          className="loading-skeleton text-skeleton"
                          sx={{ marginBottom: "20px" }}
                        />
                      </Typography>

                      {/* genre */}
                      <Typography component="div" className="typo__content">
                        <Skeleton
                          width="100px"
                          className="loading-skeleton text-skeleton"
                        />
                        <Box
                          sx={{
                            display: "flex",
                            gap: "20px",
                            flexWrap: "wrap",
                          }}
                        >
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                        </Box>
                      </Typography>

                      {/* platform */}
                      <Typography component="div" className="typo__content">
                        <Skeleton
                          width="100px"
                          className="loading-skeleton text-skeleton"
                        />
                        <Box
                          sx={{
                            display: "flex",
                            gap: "20px",
                            flexWrap: "wrap",
                          }}
                        >
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                        </Box>
                      </Typography>

                      {/* publisher */}
                      <Typography component="div" className="typo__content">
                        <Skeleton
                          width="100px"
                          className="loading-skeleton text-skeleton"
                        />
                        <Box
                          sx={{
                            display: "flex",
                            gap: "20px",
                            flexWrap: "wrap",
                          }}
                        >
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                          <Skeleton
                            width="100px"
                            sx={{
                              height: "50px !important",
                              marginBottom: "20px",
                            }}
                            className="loading-skeleton text-skeleton"
                          />
                        </Box>
                      </Typography>

                      {/* save in my list */}
                      <Typography component="div" className="typo__content">
                        <Skeleton
                          width="100px"
                          className="loading-skeleton text-skeleton"
                        />
                        <Skeleton
                          width="150px"
                          sx={{
                            height: "50px !important",
                            marginBottom: "20px",
                          }}
                          className="loading-skeleton text-skeleton"
                        />
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ margin: 5, marginTop: 0 }}>
                  {/* description */}
                  <Skeleton
                    width="100px"
                    className="loading-skeleton text-skeleton"
                  />
                  <Skeleton
                    width="100%"
                    className="loading-skeleton text-skeleton"
                  />
                  <Skeleton
                    width="100%"
                    className="loading-skeleton text-skeleton"
                  />
                  <Skeleton
                    width="50%"
                    className="loading-skeleton text-skeleton"
                  />
                </Box>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Grid container spacing={6}>
                <Grid
                  className="div-poster-img"
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    initial="hide"
                    whileInView="view"
                    variants={{
                      view: { opacity: 1, y: 0 },
                      hide: { opacity: 0, y: 50 },
                    }}
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      marginLeft: "10px",
                      width: "100%",
                      marginBottom: "20px",
                    }}
                  >
                    {/* game poster image */}
                    <img
                      alt=""
                      src={gameData.background_image}
                      className="img-poster"
                      style={{
                        width: "90%",
                        borderRadius: "10px",
                        height: "fit-content",
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Box
                    sx={{
                      paddingRight: 5,
                      fontSize: 27,
                      "@media (max-width: 768px)": {
                        paddingLeft: 5,
                      },
                      "@media (max-width: 426px)": {
                        paddingLeft: "10px",
                      },
                    }}
                  >
                    <motion.div
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      initial="hide"
                      whileInView="view"
                      variants={{
                        view: { opacity: 1, y: 0 },
                        hide: { opacity: 0, y: 50 },
                      }}
                    >
                      {/* title */}
                      <Typography component="h1" className="typo__content">
                        <Typography component="span" className="typo__title">
                          Title
                        </Typography>
                        {gameData.name}
                      </Typography>

                      {/* genre */}
                      <Typography component="div" className="typo__content">
                        <Typography component="span" className="typo__title">
                          Genre
                        </Typography>
                        <Typography
                          sx={{ display: "flex", flexWrap: "wrap" }}
                          component="div"
                        >
                          {gameGenre.map((genre, ind) => {
                            return (
                              <div key={ind} className="div__genre">
                                {genre.name}
                              </div>
                            );
                          })}
                        </Typography>
                      </Typography>

                      {/* platform */}
                      <Typography component="div" className="typo__content">
                        <Typography component="p" className="typo__title">
                          Platform & Specification
                          <Typography component="span">
                            <Tooltip
                              title="Click on platform name to view Specification"
                              arrow
                            >
                              <InfoOutlinedIcon
                                sx={{ fontSize: "15px", ml: "5px" }}
                              />
                            </Tooltip>
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{ display: "flex", flexWrap: "wrap" }}
                          component="div"
                        >
                          {gamePlatform.map((platform, ind) => {
                            return (
                              <div
                                key={ind}
                                className="div__genre div-platform"
                                onClick={() =>
                                  handleOpenSpecificationPop({
                                    platformName: platform.platform.name,
                                    specificationData: platform.requirements,
                                  })
                                }
                              >
                                {platform.platform.name}
                              </div>
                            );
                          })}
                        </Typography>
                      </Typography>

                      {/* publisher */}
                      <Typography component="div" className="typo__content">
                        <Typography component="span" className="typo__title">
                          Publisher
                        </Typography>
                        <Typography
                          sx={{ display: "flex", flexWrap: "wrap" }}
                          component="div"
                        >
                          {gamePublishers.map((publisher, ind) => {
                            return (
                              <div key={ind} className="div__genre">
                                {publisher.name}
                              </div>
                            );
                          })}
                        </Typography>
                      </Typography>

                      {/* save in list */}
                      <Typography className="typo__content" component="div">
                        <Typography className="typo__title">
                          Save In My List
                        </Typography>
                        <Typography component="div">
                          {user ? (
                            <>
                              {checkId === id ? (
                                <Button
                                  onClick={() => {
                                    deleteGameData(deleteFromListId);
                                  }}
                                  variant="outlined"
                                  sx={{
                                    color: "white",
                                    borderColor: "white",
                                    "&:hover": {
                                      color: "white",
                                      borderColor: "white",
                                    },
                                  }}
                                >
                                  <PlaylistRemoveIcon
                                    sx={{ marginRight: "10px" }}
                                  />{" "}
                                  Remove From List
                                </Button>
                              ) : (
                                <Button
                                  onClick={sendDataTOFirestore}
                                  variant="outlined"
                                  sx={{
                                    color: "white",
                                    borderColor: "white",
                                    "&:hover": {
                                      color: "white",
                                      borderColor: "white",
                                    },
                                  }}
                                >
                                  <PlaylistAddIcon
                                    sx={{ marginRight: "10px" }}
                                  />{" "}
                                  Add in My List
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={handleGoogleSignIn}
                              sx={{
                                color: "white",
                                borderColor: "white",
                                "&:hover": {
                                  color: "white",
                                  borderColor: "white",
                                },
                              }}
                            >
                              Signin With google
                            </Button>
                          )}
                        </Typography>
                      </Typography>
                    </motion.div>
                  </Box>
                </Grid>
              </Grid>
              {/* Box for non responsive content */}
              <Box
                sx={{
                  paddingLeft: 5,
                  fontSize: 27,
                  marginBottom: 5,
                  "@media (max-width: 768px)": {
                    paddingLeft: 5,
                  },
                  "@media (max-width: 426px)": {
                    paddingLeft: "10px",
                  },
                }}
              >
                {/* description */}
                <Typography component="div" className="typo__content">
                  <motion.div
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    initial="hide"
                    whileInView="view"
                    variants={{
                      view: { opacity: 1, y: 0 },
                      hide: { opacity: 0, y: 50 },
                    }}
                  >
                    <Typography component="span" className="typo__title">
                      Description
                    </Typography>
                    <Typography component="p">
                      {gameData.description_raw}
                    </Typography>
                  </motion.div>
                </Typography>

                {/* screenshot */}
                <Typography component="div" className="typo__content">
                  <motion.div
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    initial="hide"
                    whileInView="view"
                    variants={{
                      view: { opacity: 1, y: 0 },
                      hide: { opacity: 0, y: 50 },
                    }}
                  >
                    <Typography component="span" className="typo__title">
                      Screenshots
                    </Typography>
                    <Box sx={{ width: "100%", position: "relative" }}>
                      <GameScreenshotSlider gameId={id} />
                      <Box className="div-screenshot-parent"></Box>
                      <PopupScreenshotComponent
                        ImageIconComponent={FullscreenIcon}
                        id={id}
                      />
                    </Box>
                  </motion.div>
                </Typography>
                {/* Similer Game Series */}
                <Box sx={{ marginTop: "20px" }}>
                  <motion.div
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    initial="hide"
                    whileInView="view"
                    variants={{
                      view: { opacity: 1, y: 0 },
                      hide: { opacity: 0, y: 50 },
                    }}
                  >
                    <Typography component="span" className="typo__title">
                      Similer Game Series
                    </Typography>
                  </motion.div>
                  <Box className="box-similer-game-series-parent">
                    {similerGameSeries[0] ? (
                      <Grid
                        container
                        // spacing={6}
                        item
                        lg
                        md
                        sm
                        xs
                        className="box-similer-game-series-scroller"
                        columnSpacing="20px"
                        rowGap="20px"
                        sx={{
                          "@media(max-width: 426px)": {
                            display: "flex",
                            justifyContent: "center",
                          },
                        }}
                      >
                        <GameData
                          data={similerGameSeries}
                          changeGridWidth="300px"
                          changeWidth="auto"
                        />
                      </Grid>
                    ) : (
                      <React.Fragment>
                        <Box className="box-no-similer-game-found">
                          <Typography component="p">
                            No Similer Game Series Found
                          </Typography>
                        </Box>
                      </React.Fragment>
                    )}
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </div>
      </motion.div>
      {loading ? null : (
        <>
          <Box sx={{ width: "100%" }}>
            <motion.div
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              initial="hide"
              whileInView="view"
              variants={{
                view: { opacity: 1, y: 0 },
                hide: { opacity: 0, y: 50 },
              }}
            >
              <Typography
                component="span"
                className="typo__title span-creaters"
                sx={{
                  "@media(max-width: 500px)": {
                    ml: "15px !important",
                  },
                }}
              >
                {gameData.name} is Developed by
              </Typography>
              <ContentComponentCarousel id={id} />
            </motion.div>
          </Box>
        </>
      )}
    </>
  );
};

export default GamePage;
