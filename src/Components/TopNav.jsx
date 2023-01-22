import React, { useEffect, useState } from "react";
import "./styles/TopNav.css";
import { NavLink, useLocation } from "react-router-dom";
import { Drawer, Box, Container, Typography, Divider } from "@mui/material";
import { paperClasses } from "@mui/material";
import axios from "axios";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiFillAndroid,
  AiOutlineGoogle,
  AiOutlineMenu,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { AuthUseContext } from "./context/AuthContext";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ComputerIcon from "@mui/icons-material/Computer";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";
import AppleIcon from "@mui/icons-material/Apple";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import SaveOrRemoveList from "./SaveOrRemoveList";
import StarIcon from "@mui/icons-material/Star";
import { FiLogOut } from "react-icons/fi";
import Profile from "./Profile";

const TopNav = () => {
  const playstationSubPlatform = [
    {
      id: 18,
      name: "PS 4",
    },
    {
      id: 187,
      name: "PS 5",
    },
  ];

  const XboxSubPlatform = [
    {
      id: 1,
      name: "Xbox One",
    },
    {
      id: 186,
      name: "Xbox Series X",
    },
  ];

  const { user, apiKey, handleGoogleSignIn, logOut } = AuthUseContext();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [openSideBar, setOpenSideBar] = useState(false); // open side nav bar when click on button

  const dropdownAnimation = {
    enter: {
      opacity: 1,
      top: "30px",
      width: "200px",
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.5,
      },
      visibility: "visible",
    },
    exit: {
      opacity: 0,
      top: "20px",
      width: "0px",
      height: "0px",
      transition: {
        duration: 0.2,
        delay: 0.3,
      },
      transitionEnd: {
        visibility: "hidden",
      },
    },
  };

  const dropdownLinkAnimation = {
    enter: {
      opacity: 1,
      position: "relative",
      y: 0,
      transition: {
        delay: 0.5,
      },
      visibility: "visible",
    },
    exit: {
      position: "relative",
      opacity: 0,
      y: -20,
      transitionEnd: {
        visibility: "hidden",
      },
    },
  };

  const subDropdownAnimation = {
    enter: {
      top: "30px",
      y: 0,
      width: "200px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.5,
        delay: 0.3,
      },
      display: "block",
    },
    exit: {
      top: "20px",
      width: "0px",
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  const [openPlatformDropdown, setOpenPlatformDropdown] = useState(false);

  const openPlatformSelect = () => {
    if (!openPlatformDropdown) {
      setOpenPlatformDropdown(true);
    } else {
      setOpenPlatformDropdown(false);
    }
  };

  // playstation sub dropdown
  const [openPlaystationSubDropdown, setOpenPlaystationSubDropdown] =
    useState(false);

  const openPlaystationSubPlatformSelect = () => {
    if (!openPlaystationSubDropdown) {
      setOpenPlaystationSubDropdown(true);
    } else {
      setOpenPlaystationSubDropdown(false);
    }
  };

  // xbox sub dropdown
  const [openXboxSubDropdown, setOpenXboxSubDropdown] = useState(false);

  const openXboxSubPlatformSelect = () => {
    if (!openXboxSubDropdown) {
      setOpenXboxSubDropdown(true);
    } else {
      setOpenXboxSubDropdown(false);
    }
  };

  const [openSearchPopupBox, setOpenSearchPopupBox] = React.useState(false);

  const mediaTheme = useTheme();

  const fullScreen = useMediaQuery(mediaTheme.breakpoints.down("md"));

  const [storeSearchValue, setStoreSearchValue] = useState("");

  const handleOpenSearch = () => {
    setOpenSearchPopupBox(true);
  };

  const handleCloseSearch = () => {
    setOpenSearchPopupBox(false);
    setSearchGamesData([]);
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 191 && e.ctrlKey) {
        handleOpenSearch();
      }
    });
  }, []);

  const [searchGamesData, setSearchGamesData] = useState([]);

  const searchGames = () => {
    axios
      .get(
        `https://api.rawg.io/api/games?key=${apiKey}&search=${storeSearchValue}&page_size=20`
      )
      .then((res) => {
        if (storeSearchValue === "") {
          setSearchGamesData([]);
        } else {
          setSearchGamesData(res.data.results);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const searchInputText = (e) => {
    setStoreSearchValue(
      e.target.value
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(" ")
        .join("-")
    );
  };

  let countGameGenre = 0;

  const [showProfile, setShowProfile] = useState(false);

  const profileShow = () => {
    setShowProfile(true);
  };

  const profileHide = () => {
    setShowProfile(false);
  };

  const closeMenu = () => {
    setOpenSideBar(false);
  };

  return (
    <React.Fragment>
      {/* profile dialog box */}
      <Profile open={showProfile} close={profileHide} fullScreen={fullScreen} />

      {/* search dialog box */}
      <Dialog
        fullScreen={fullScreen}
        open={openSearchPopupBox}
        onClose={handleCloseSearch}
        aria-labelledby="responsive-dialog-title"
        sx={{
          [`& .${paperClasses.root}`]: {
            color: "white",
            backgroundColor: "#151515",
            width: "100%",
            height: "100%",
          },
        }}
      >
        <DialogContent
          sx={{
            padding: "0px",
          }}
        >
          <motion.div className="div-search-parent">
            <Box className="div-search-box">
              <input
                type="text"
                onChange={searchInputText}
                placeholder="Search Games..."
                className="in-search-games"
                autoFocus={true}
              />
              <Box className="div-in-search-icon" onClick={searchGames}>
                <AiOutlineSearch />
              </Box>
            </Box>
            <Box onClick={handleCloseSearch} className="div-close-search-icon">
              <CloseIcon />
            </Box>
          </motion.div>
          {!searchGamesData[0] ? (
            <Box className="div-search-games-text">
              <motion.div
                className="div-no-game"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 50 },
                }}
              >
                Start typing in search box, after typing click on search button
                to search games
              </motion.div>
            </Box>
          ) : (
            <Box className="div-search-content-parent">
              {searchGamesData.map((data, index) => (
                <motion.div
                  className="div-search-games-parent"
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 50 },
                  }}
                >
                  <Box className="div-game-container game-search-box">
                    <Box className="div-search-game-poster">
                      <Box className="div-save-fun">
                        <SaveOrRemoveList gameId={data.id} />
                        <Box className="div-rating">
                          <StarIcon />
                          {data.rating}
                        </Box>
                      </Box>
                      <img
                        src={data.background_image}
                        className="img-game-search-poster"
                        style={{ width: "100%" }}
                        alt=""
                      />
                    </Box>
                    <Box className="div-text-info-container">
                      <Link to={`/game/${data.id}`} onClick={handleCloseSearch}>
                        <Typography component="p" sx={{ my: "10px" }}>
                          {data.name}
                        </Typography>
                        <Divider sx={{ borderColor: "#303030", m: "5px" }} />
                        {/* release date */}
                        <Box className="box-release-and-genre-container">
                          <Typography component="p">Release Date</Typography>
                          <Typography component="p">{data.released}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: "#303030", m: "5px" }} />
                        <Box className="box-release-and-genre-container">
                          <Typography component="p">Genre</Typography>
                          <Typography component="p">
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
                      </Link>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* hidden side bar only visible for mobile and tablet */}
      <Container>
        <Drawer
          open={openSideBar}
          onClose={closeMenu}
          sx={{
            [`& .${paperClasses.root}`]: {
              color: "white",
              backgroundColor: "#151515",
            },
          }}
        >
          <Box
            sx={{
              width: 300,
            }}
          >
            <Box className="div-platform-side-menu">
              <Box className="div-menu-user-info">
                {user ? (
                  <Box className="menu-user-info">
                    <img src={user.photoURL} className="pro-nav-img" alt="" />
                    <Typography component="span">{user.displayName}</Typography>
                  </Box>
                ) : (
                  <Box onClick={handleGoogleSignIn} className="div-signin">
                    <AiOutlineGoogle />
                    Sign In with Google
                  </Box>
                )}
              </Box>
              <Divider
                sx={{
                  borderColor: "#535353",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              />
              <Box className="div-menu-platforms-box">
                <Link to="/">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Home
                  </Box>
                </Link>
                <Link to="/platform/4">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    PC
                  </Box>
                </Link>
              </Box>
              <Box className="div-menu-platforms-box">
                <Link to="/platform/18">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Playstation 4
                  </Box>
                </Link>
                <Link to="/platform/187">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Playstation 5
                  </Box>
                </Link>
              </Box>
              <Box className="div-menu-platforms-box">
                <Link to="/platform/1">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Xbox One
                  </Box>
                </Link>
                <Link to="/platform/186">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Xbox Series X
                  </Box>
                </Link>
              </Box>
              <Box className="div-menu-platforms-box">
                <Link to="/platform/7">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Nintendo Switch
                  </Box>
                </Link>
              </Box>
              <Box className="div-menu-platforms-box">
                <Link to="/platform/21">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    Android
                  </Box>
                </Link>
              </Box>
              <Box className="div-menu-platforms-box">
                <Link to="/platform/3">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    IOS
                  </Box>
                </Link>
              </Box>
              <Box className="div-menu-platforms-box">
                <Link to="/list">
                  <Box className="platform-menu-links" onClick={closeMenu}>
                    List
                  </Box>
                </Link>
              </Box>
              {user ? (
                <>
                  <Divider
                    sx={{
                      borderColor: "#535353",
                      margin: "10px",
                    }}
                  />
                  <Box className="div-menu-user-info">
                    <Box className="div-logout div-signin" onClick={logOut}>
                      <FiLogOut /> Logout
                    </Box>
                  </Box>
                </>
              ) : null}
            </Box>
          </Box>
        </Drawer>
      </Container>
      {/* top nav bar */}
      <nav className="top-nav">
        <div className="div-left">
          <div className="div-menu">
            <AiOutlineMenu
              onClick={() => setOpenSideBar(true)}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <div className="div-game-logo">
            <motion.p
            // initial="hide"
            // whileInView="view"
            // transition={{ duration: 1, delay: 1.3 }}
            // variants={{
            //   view: { opacity: 1, x: 0 },
            //   hide: { opacity: 0, x: -100 },
            // }}
            >
              <span
                style={{
                  color: "rgb(255 123 22)",
                }}
              >
                Game
              </span>
              List
            </motion.p>
          </div>
          {/* platform */}
          <div className="div-parent-link">
            <NavLink to="/">
              <div className="div-change-bg-hover">
                {/* <motion.div
                  initial="hide"
                  whileInView="view"
                  transition={{ duration: 1, delay: 1 }}
                  variants={{
                    view: { opacity: 1, x: 0 },
                    hide: { opacity: 0, x: -100 },
                  }}
                > */}
                Home
                {/* </motion.div> */}
              </div>
            </NavLink>
            <motion.div
              onMouseEnter={openPlatformSelect}
              onMouseLeave={openPlatformSelect}
              className="platform-parent-dropdown div-change-bg-hover"
              // initial="hide"
              // whileInView="view"
              // transition={{ duration: 1, delay: 0.9 }}
              // variants={{
              //   view: { opacity: 1, x: 0 },
              //   hide: { opacity: 0, x: -100 },
              // }}
            >
              Platform{" "}
              <span>
                <ArrowDropDownIcon />
              </span>
              <motion.div
                initial="exit"
                animate={openPlatformDropdown ? "enter" : "exit"}
                variants={dropdownAnimation}
                style={{ background: "#1f1f1f" }}
                className="platform-dropdown"
              >
                <motion.div
                  initial="exit"
                  animate={openPlatformDropdown ? "enter" : "exit"}
                  variants={dropdownLinkAnimation}
                >
                  <NavLink to="/platform/4">
                    <Box className="div-platform-name">
                      <Box className="div-platform-with-icons">
                        <span>
                          <ComputerIcon />
                        </span>
                        PC
                      </Box>
                    </Box>
                  </NavLink>
                </motion.div>
                {/* playstation */}
                <motion.div
                  initial="exit"
                  animate={openPlatformDropdown ? "enter" : "exit"}
                  variants={dropdownLinkAnimation}
                >
                  <Box
                    onMouseEnter={openPlaystationSubPlatformSelect}
                    onMouseLeave={openPlaystationSubPlatformSelect}
                    className="div-platform-name sub-platform-with-arrow"
                  >
                    <Box className="div-platform-with-icons">
                      <span>
                        <FaPlaystation />
                      </span>
                      Playstation
                    </Box>{" "}
                    <span>
                      <ArrowRightIcon />
                    </span>
                    <motion.div
                      initial="exit"
                      animate={openPlaystationSubDropdown ? "enter" : "exit"}
                      variants={dropdownAnimation}
                      className="platform-dropdown div-sub-platform"
                    >
                      {playstationSubPlatform.map((data) => (
                        <motion.div
                          initial="exit"
                          animate={openPlatformDropdown ? "enter" : "exit"}
                          variants={subDropdownAnimation}
                          key={data.id}
                        >
                          <NavLink to={`/platform/${data.id}`}>
                            <Box className="div-platform-name" key={data.id}>
                              {data.name}
                            </Box>
                          </NavLink>
                        </motion.div>
                      ))}
                    </motion.div>
                  </Box>
                </motion.div>
                {/* xbox */}
                <motion.div
                  initial="exit"
                  animate={openPlatformDropdown ? "enter" : "exit"}
                  variants={dropdownLinkAnimation}
                >
                  <Box
                    onMouseEnter={openXboxSubPlatformSelect}
                    onMouseLeave={openXboxSubPlatformSelect}
                    className="div-platform-name sub-platform-with-arrow"
                  >
                    <Box className="div-platform-with-icons">
                      <span>
                        <FaXbox />
                      </span>
                      Xbox
                    </Box>{" "}
                    <span>
                      <ArrowRightIcon />
                    </span>
                    <motion.div
                      initial="exit"
                      animate={openXboxSubDropdown ? "enter" : "exit"}
                      variants={dropdownAnimation}
                      className="platform-dropdown div-sub-platform"
                    >
                      {XboxSubPlatform.map((data) => (
                        <motion.div
                          initial="exit"
                          animate={openPlatformDropdown ? "enter" : "exit"}
                          variants={subDropdownAnimation}
                          key={data.id}
                        >
                          <NavLink to={`/platform/${data.id}`}>
                            <Box className="div-platform-name" key={data.id}>
                              {data.name}
                            </Box>
                          </NavLink>
                        </motion.div>
                      ))}
                    </motion.div>
                  </Box>
                </motion.div>
                {/* nintendo */}
                <motion.div
                  initial="exit"
                  animate={openPlatformDropdown ? "enter" : "exit"}
                  variants={dropdownLinkAnimation}
                >
                  <NavLink to="/platform/7">
                    <Box className="div-platform-name sub-platform-with-arrow">
                      <Box className="div-platform-with-icons">
                        <span>
                          <SiNintendoswitch />
                        </span>
                        Nintendo Switch
                      </Box>
                    </Box>
                  </NavLink>
                </motion.div>
                <motion.div
                  initial="exit"
                  animate={openPlatformDropdown ? "enter" : "exit"}
                  variants={dropdownLinkAnimation}
                >
                  <NavLink to="/platform/3">
                    <Box className="div-platform-name">
                      <Box className="div-platform-with-icons">
                        <span>
                          <AppleIcon />
                        </span>
                        IOS
                      </Box>
                    </Box>
                  </NavLink>
                </motion.div>
                <motion.div
                  initial="exit"
                  animate={openPlatformDropdown ? "enter" : "exit"}
                  variants={dropdownLinkAnimation}
                >
                  <NavLink to="/platform/21">
                    <Box className="div-platform-name">
                      <Box className="div-platform-with-icons">
                        <span>
                          <AiFillAndroid />
                        </span>
                        Android
                      </Box>
                    </Box>
                  </NavLink>
                </motion.div>
              </motion.div>
            </motion.div>
            {/* list */}
            <NavLink to="/list">
              <div className="div-change-bg-hover">
                <motion.div
                // initial="hide"
                // whileInView="view"
                // transition={{ duration: 1, delay: 0.7 }}
                // variants={{
                //   view: { opacity: 1, x: 0 },
                //   hide: { opacity: 0, x: -100 },
                // }}
                >
                  List
                </motion.div>
              </div>
            </NavLink>
            {user ? (
              <div className="div-change-bg-hover" onClick={logOut}>
                <motion.div
                // initial="hide"
                // whileInView="view"
                // transition={{ duration: 1, delay: 0.5 }}
                // variants={{
                //   view: { opacity: 1, x: 0 },
                //   hide: { opacity: 0, x: -100 },
                // }}
                >
                  Logout
                </motion.div>
              </div>
            ) : (
              <div className="div-change-bg-hover" onClick={handleGoogleSignIn}>
                <motion.div
                // initial="hide"
                // whileInView="view"
                // transition={{ duration: 1, delay: 0.5 }}
                // variants={{
                //   view: { opacity: 1, x: 0 },
                //   hide: { opacity: 0, x: -100 },
                // }}
                >
                  Signin
                </motion.div>
              </div>
            )}
          </div>
        </div>
        <div className="div-right-content">
          <motion.div
            // initial="hide"
            // whileInView="view"
            // transition={{ duration: 1 }}
            // variants={{
            //   view: { opacity: 1, x: 0 },
            //   hide: { opacity: 0, x: 100 },
            // }}
            className="div-search-content"
            onClick={handleOpenSearch}
          >
            <input
              type="text"
              placeholder="Search..."
              disabled
              className="input-disabled-search"
            />
            <div className="div-search-icon">
              <AiOutlineSearch />
            </div>
            <Box className="div-press-key-search">Ctrl + /</Box>
          </motion.div>
          <motion.div
            className="pro-div-img"
            // initial="hide"
            // whileInView="view"
            // transition={{ duration: 1, delay: 0.5 }}
            // variants={{
            //   view: { opacity: 1 },
            //   hide: { opacity: 0 },
            // }}
            onClick={profileShow}
          >
            {user ? (
              <div>
                <Tooltip title="Profile" arrow>
                  <span>
                    <img
                      src={user.photoURL}
                      className="pro-nav-img"
                      style={{
                        marginTop: 4,
                      }}
                      alt=""
                    />
                  </span>
                </Tooltip>
              </div>
            ) : (
              <>
                <Tooltip title="Sign In" arrow>
                  <Typography
                    sx={{
                      fontSize: 25,
                      marginTop: 1,
                    }}
                  >
                    <AiOutlineUser />
                  </Typography>
                </Tooltip>
              </>
            )}
            {/* </Link> */}
          </motion.div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default TopNav;
